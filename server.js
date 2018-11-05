const express = require('express');
const morgan = require('morgan');
const {DATABASE_URL} = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

const {blogPosts} = require('./models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

//GET /posts

app.get('/authors', (req, res) => {
  author.find()
  .then(authors => {
    res.json(authors.map(author => {
      return {
        id: author._id,
        name: `${author.firstName} ${author.lastName}`,
        userName: author.userName
      };
    }))
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'error' });
    });
});

//pre hook with the populate() method make all posts look like previoiusly did
// {"title":  "some title", etc.}
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
//add an array of comments to single blog post

app.get('/posts/:id', (req, res) => {
  blogPost.findById()
  .then(posts => {
    res.json({
      id: post._id,
      author: post.authorName,
      content: post.content,
      title: post.title,
      comments: post.comments
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'uh-oh error'});
  });
});

//POST /posts

app.post('/authors', (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'userName'];
  for (let i =0; i < requiredFields[i]; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
    const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  author.findOne({ userName: req.body.userName })
  .then(author => {
    if (author) {
      const message = `Requested username (${req.body.userName}) is already taken by another author`;
      console.error(message);
      return res.status(400).send(message);
    } else {
      author.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.bodyusertName,
    })
    .then(author => res.status(201).json({
      _id: author.id,
      name: `${author.firstName} ${author.lastName}`,
      userName: author.userName
    }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'uh oh' });
    });
  }
})

//request body should now contain json object

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
  author.findById(req.body.author_id)
  .then(author => {
    blogPost.create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json({
      id: blogPost.id,
      author: `${author.firstName} ${author.lastName}`,
      content: blogPost.content,
      title: blogPost.title,
      comments: blogPost.comments
    }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'uh-oh' });
    });
  });
})


//PUT /posts/:id

app.put('/authors/:id', (req, res) => {
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  blogPost.update({
    id: req.params.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.bodyusertName,
  })
  .then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
});
//only allow update title and content

app.put('/posts/:id', (req, res) => {
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  const updated = {};
  const updateable = ['title', 'content'];
  updateable.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  blogPost.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  })
});

//DELETE /authors/:id
app.delete('/authors/:id', (req, res) => {
  authors.findByIdAndRemove(req.params.id)
  //need to delete blog posts by author
  .then(() => {
    console.log(`Deleting author \`${req.params.id}\``);
    res.status(204).end();
  });
});

//DELETE /posts/:id

app.delete('/posts/:id', (req, res) => {
  blogPost.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`Deleting blog post \`${req.params.id}\``);
    res.status(204).end();
  });
});


app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

//server function for tests

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    })
    .on('error', err => {
      reject(err);
    });
  });
}


function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { runServer, app, closeServer };