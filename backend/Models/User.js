const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Hide password by default in queries
    },
    image: {
      type: String,
      default: '',
    },
  favorites: { 
    type: Array, 
    default: [] 
  },
  watchlist: { 
    type: Array, 
    default: [] 
  },

    reviews: [
      {
        movieId: {
          type: Number,
          required: true,
        },
        movieTitle: String,
        rating: {
          type: Number,
          min: 0,
          max: 10,
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
