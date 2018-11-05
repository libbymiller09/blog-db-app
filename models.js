import { Mongoose } from "mongoose";

const blogSchema = Mongoose.Schema({
  title: String,
  content: String,
  author: [ {firstName: String}, {lastName: String} ],
  created: Date
});

const blogPost = mongoose.model('Blog', blogSchema);

blogSchema.virtual('authorName')
  .get(function() {
    const auth = this.author;
    return `${auth.firstName} ${auth.lastName}`;
  })
  .set(function( authorName ) {
    const [first, last] = authorName.split(' ');
    this.author.firstName = first;
    this.author.lastName = last;
  });