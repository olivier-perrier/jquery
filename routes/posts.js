var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')

module.exports = router;