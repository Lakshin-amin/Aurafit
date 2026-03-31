const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now, required: true },
  type: { type: String, enum: ['body_metrics','workout_log','personal_record'], required: true },

  bodyMetrics: {
    weight:     { type: Number },
    bodyFat:    { type: Number },
    muscleMass: { type: Number },
    chest:      { type: Number },
    waist:      { type: Number },
    hips:       { type: Number },
    arms:       { type: Number },
    legs:       { type: Number }
  },

  workoutLog: {
    workoutPlan:    { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan' },
    dayName:        { type: String },
    duration:       { type: Number },
    caloriesBurned: { type: Number },
    exercises: [{
      exercise:     { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
      exerciseName: { type: String },
      sets: [{ reps: Number, weight: Number, duration: Number, completed: Boolean }]
    }],
    notes:       { type: String },
    mood:        { type: String, enum: ['terrible','bad','okay','good','great'] },
    energyLevel: { type: Number, min: 1, max: 10 }
  },

  personalRecord: {
    exercise:     { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    exerciseName: { type: String },
    metric:       { type: String, enum: ['max_weight','max_reps','fastest_time','longest_distance'] },
    value:        { type: Number },
    unit:         { type: String }
  }
}, { timestamps: true });

progressSchema.index({ user: 1, date: -1 });
progressSchema.index({ user: 1, type: 1 });
module.exports = mongoose.model('Progress', progressSchema);
