const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'],
    trim: true, maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String, required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'], select: false
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'elite'],
    default: 'beginner'
  },
  goals: [{
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'strength', 'general_fitness']
  }],
  stats: {
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    age:    { type: Number, default: 0 },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' }
  },
  role: { type: String, enum: ['user', 'trainer', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
