import { Mongoose } from "mongoose";
import { userInfo } from "os";

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const blogPost = mongoose.model('blogPost', blogSchema);
const author = mongoose.model('author', authorSchema);

const blogSchema = Mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'author' },
  comments: [commentSchema],
  created: Date
});

blogSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

blogSchema.pre('findOne', function(next) {
  this.populate('author');
next();
});

const authorSchema = Mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    unique: true
  }
});

blogSchema.virtual('authorName')
  .get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
  });

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    comments: this.comments,
    created: this.created
  };
};

module.exports = {blogPost};
