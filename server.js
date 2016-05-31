'use strict'

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let basicAuth = require('basic-auth');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lst2');
let List = mongoose.model('List', { list: String, content: String });

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === process.env.USER && user.pass === process.env.PASS) {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(auth);

app.get('/data', function (req, res) {
  List.find({}, function(err, lists) {
      if (err) res.send(err)
      else res.send(lists)
  });
});

app.post('/data', function(req, res) {
  List.update(
    { list: req.body.list },
    { content: req.body.content },
    { upsert: true },
    function (err, list) {
      if (err) res.send(err)
      else res.send(list)
  });
});

app.listen(process.env.PORT || 8080);
