const mongoose = require('mongoose');

const workoutDaySchema = new mongoose.Schema({
  dayName:  { type: String, required: true },
  dayNumber:{ type: Number, required: true },
  focus:    { type: String },
  exercises: [{
    exercise:  { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets:      { type: Number, default: 3 },
    reps:      { type: String, default: '10' },
    duration:  { type: Number, default: 0 },
    restTime:  { type: Number, default: 60 },
    notes:     { type: String, default: '' },
    order:     { type: Number, default: 0 }
  }],
  estimatedDuration: { type: Number, default: 45 },
  isRestDay: { type: Boolean, default: false }
});

const workoutPlanSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String, required: true,
    enum: ['strength','cardio','hiit','flexibility','sports','weight_loss','muscle_gain','endurance']
  },
  difficulty: {
    type: String,
    enum: ['beginner','intermediate','advanced','elite'], default: 'intermediate'
  },
  durationWeeks:  { type: Number, default: 4 },
  daysPerWeek:    { type: Number, default: 3 },
  schedule:       [workoutDaySchema],
  tags:           [String],
  targetGoals:    [{ type: String }],
  equipment:      [{ type: String }],
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic:       { type: Boolean, default: true },
  enrolledUsers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
