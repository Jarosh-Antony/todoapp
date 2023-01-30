var express = require('express');
var router = express.Router();
const client = require('../db.js');


router.get('/', function(req, res, next) {
	res.render('register');
});


router.post('/', function(req, res, next) {
	client.connect(err => {
		if (err) throw err;
		const db = client.db('todo');
		const result=db.collection('Users').insertOne(req.body);
	});
	res.redirect('/todo');
});

module.exports = router;
