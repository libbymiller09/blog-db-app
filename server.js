const express = require('express');
const morgan = require('morgan');
const {DATABASE_URL} = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

const {BlogPosts} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

//GET /posts

app.get('/posts', (req, res) => {
  blogPost.find()
  .then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
  .catch(err => {
  console.error(err);
  res.status(500).json({error: 'error' });
  });
});

//GET /posts/:id

app.get('/posts/:id', (req, res) => {
  blogPost.findById()
  .then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'uh-oh error'});
  });
});

//POST /posts

app.post('/posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  blogPost.create({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
  .then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
  .catch(err => {
  console.error(err);
  res.status(500).json({error: 'error' });
  });
});


//PUT /posts/:id

app.put('/posts/:id', (req, res) => {
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating blog post \`${req.params.id}\``);
  blogPost.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
  .then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
});

//DELETE /posts/:id

app.delete('/posts/:id', (req, res) => {
  blogPost.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`Deleting blog post \`${req.params.id}\``);
    res.status(204).end();
  });
});
