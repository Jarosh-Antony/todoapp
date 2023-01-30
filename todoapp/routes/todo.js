var express = require('express');
var router = express.Router();
const client = require('../db.js');


router.get('/', function(req, res, next) {
	res.render('todo');
});



module.exports = router;
