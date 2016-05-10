'use strict'

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');


app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lst2');

let List = mongoose.model('List', { list: String, content: String });

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
