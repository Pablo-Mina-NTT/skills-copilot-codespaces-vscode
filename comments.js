// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

// Parse POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files
app.use(express.static('public'));

// Get comments
app.get('/comments', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading comments.json');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// Post comments
app.post('/comments', function(req, res) {
  var newComment = req.body;
  fs.readFile('comments.json', function(err, data) {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading comments.json');
      return;
    }
    var comments = JSON.parse(data);
    comments.push(newComment);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 2), function(err) {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing comments.json');
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(comments));
    });
  });
});

// Start server
var server = app.listen(3000, function() {
  console.log('Server listening on port 3000');
});