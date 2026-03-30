const Progress = require('../models/Progress');

exports.logProgress = async (req, res) => {
  try {
    const progress = await Progress.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, progress });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getProgress = async (req, res) => {
  try {
    const { type, startDate, endDate, limit = 30 } = req.query;
    const query = { user: req.user.id };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate)   query.date.$lte = new Date(endDate);
    }
    const progress = await Progress.find(query)
      .populate('workoutLog.workoutPlan', 'title')
      .populate('personalRecord.exercise', 'name')
      .sort({ date: -1 })
      .limit(Number(limit));
    res.json({ success: true, count: progress.length, progress });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const uid = req.user.id;
    const workoutCount  = await Progress.countDocuments({ user: uid, type: 'workout_log' });
    const latestMetrics = await Progress.findOne({ user: uid, type: 'body_metrics' }).sort({ date: -1 });
    const personalRecords = await Progress.find({ user: uid, type: 'personal_record' }).sort({ date: -1 }).limit(5);

    const oneWeekAgo = new Date(); oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyWorkouts = await Progress.find({ user: uid, type: 'workout_log', date: { $gte: oneWeekAgo } });
    const weeklyCalories = weeklyWorkouts.reduce((s, w) => s + (w.workoutLog?.caloriesBurned || 0), 0);

    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const weightHistory = await Progress.find({
      user: uid, type: 'body_metrics',
      date: { $gte: thirtyDaysAgo }, 'bodyMetrics.weight': { $exists: true, $gt: 0 }
    }).sort({ date: 1 }).select('date bodyMetrics.weight');

    res.json({
      success: true,
      stats: {
        totalWorkouts: workoutCount,
        weeklyCalories,
        weeklyWorkouts: weeklyWorkouts.length,
        latestMetrics: latestMetrics?.bodyMetrics || null,
        personalRecords,
        weightHistory: weightHistory.map(p => ({ date: p.date, weight: p.bodyMetrics.weight }))
      }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!progress) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, message: 'Entry deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
