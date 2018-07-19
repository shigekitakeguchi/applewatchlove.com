"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var ogs = require('open-graph-scraper');
var apicache = require('apicache');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cache = apicache.middleware;

app.post('/blogcard', function(req, res) {
  var options = {'url': req.body.URL};
  ogs(options)
  .then(function (result) {
    console.log(result);
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
    res.end();
  })
  .catch(function (error) {
    console.log('error:', error);
  });
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
});

module.exports = router;
