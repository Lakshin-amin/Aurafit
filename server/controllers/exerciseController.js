const Exercise = require('../models/Exercise');

exports.getExercises = async (req, res) => {
  try {
    const { category, difficulty, muscleGroup, equipment, search, page = 1, limit = 20 } = req.query;
    const query = { isPublic: true };
    if (category)    query.category     = category;
    if (difficulty)  query.difficulty   = difficulty;
    if (muscleGroup) query.muscleGroups = { $in: [muscleGroup] };
    if (equipment)   query.equipment   = { $in: [equipment] };
    if (search)      query.$text        = { $search: search };

    const total     = await Exercise.countDocuments(query);
    const exercises = await Exercise.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, count: exercises.length, total, pages: Math.ceil(total / limit), exercises });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id).populate('createdBy', 'name');
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    res.json({ success: true, exercise });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, exercise });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    res.json({ success: true, exercise });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    res.json({ success: true, message: 'Exercise deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
