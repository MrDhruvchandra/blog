import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema({
  text: String,
  comment: String,
  authorId: String,
  authorName: String,
  createdAt: { type: Date, default: Date.now },
  range: {
    start: Number,
    end: Number
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorAvatar: String,
  highlights: [highlightSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

postSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Post = mongoose.model('Post', postSchema);