import { Mongoose } from "mongoose";

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const blogSchema = Mongoose.Schema({
  title: String,
  content: String,
  author: {
    firstName: String, 
    lastName: String
  },
  created: Date
});

const blogPost = mongoose.model('blogPost', blogSchema);
const author = mongoose.model('author', authorSchema);

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
    created: this.created
  };
};

module.exports = {blogPost};
