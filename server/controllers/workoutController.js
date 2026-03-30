const WorkoutPlan = require('../models/WorkoutPlan');

exports.getWorkoutPlans = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 9 } = req.query;
    const query = { isPublic: true };
    if (category)   query.category   = category;
    if (difficulty) query.difficulty = difficulty;
    const total = await WorkoutPlan.countDocuments(query);
    const plans = await WorkoutPlan.find(query)
      .populate('createdBy', 'name role')
      .populate('schedule.exercises.exercise', 'name category muscleGroups')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, count: plans.length, total, plans });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id)
      .populate('createdBy', 'name role')
      .populate('schedule.exercises.exercise');
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, plan });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.createWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, plan });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.updateWorkoutPlan = async (req, res) => {
  try {
    let plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    if (plan.createdBy.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, plan });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.enrollInPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    if (plan.enrolledUsers.includes(req.user.id))
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    plan.enrolledUsers.push(req.user.id);
    await plan.save();
    res.json({ success: true, message: 'Enrolled successfully', plan });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getMyPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({
      $or: [{ createdBy: req.user.id }, { enrolledUsers: req.user.id }]
    }).populate('createdBy', 'name');
    res.json({ success: true, plans });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    if (plan.createdBy.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await plan.deleteOne();
    res.json({ success: true, message: 'Plan deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
