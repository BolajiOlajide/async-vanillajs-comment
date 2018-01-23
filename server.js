const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const Pusher = require('pusher');

require('dotenv').config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'us2',
  encrypted: true
});

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 9000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/comment', function(req, res){
  const newComment = {
    name: req.body.name,
    email: req.body.email,
    comment: req.body.comment
  }
  pusher.trigger('flash-comments', 'new_comment', newComment);
  res.json({ created: true });
});

// Error Handler for 404 Pages
app.use(function(req, res, next) {
    const error404 = new Error('Route Not Found');
    error404.status = 404;
    next(error404);
});

module.exports = app;

app.listen(PORT, function(){
  console.log(`Example app listening on port ${PORT}!`)
});
