import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // 🔹 Google Auth specific fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allow null but still unique when present
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    role: {
      type: String,
      enum: {
        values: ['admin',"user"],
        message: 'Role must be one of: admin, hr, manager, employee',
      },
      default: 'user',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ googleId: 1 });

const User = mongoose.model('User', userSchema);
export default User;
