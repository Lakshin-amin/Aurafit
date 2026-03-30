const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true },
  category: {
    type: String, required: true,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'plyometric', 'functional', 'hiit']
  },
  muscleGroups: [{
    type: String,
    enum: ['chest','back','shoulders','biceps','triceps','forearms','core','glutes','quads','hamstrings','calves','full_body']
  }],
  equipment: [{
    type: String,
    enum: ['none','barbell','dumbbell','kettlebell','resistance_band','cable','machine','bodyweight','pull_up_bar','bench']
  }],
  difficulty: {
    type: String,
    enum: ['beginner','intermediate','advanced','elite'], default: 'beginner'
  },
  instructions:       [{ step: Number, text: String }],
  tips:               [String],
  videoUrl:           { type: String, default: '' },
  caloriesPerMinute:  { type: Number, default: 5 },
  createdBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic:           { type: Boolean, default: true }
}, { timestamps: true });

exerciseSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Exercise', exerciseSchema);
