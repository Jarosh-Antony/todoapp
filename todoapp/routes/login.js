var express = require('express');
var router = express.Router();
const client = require('../db.js');

router.get('/', function(req, res, next) {
	res.render('login');
});


router.post('/', function(req, res, next) {
	client.connect(err => {
		if (err) throw err;
		const db = client.db('todo');
		db.collection('Users').find(req.body).toArray((err, result) => {
			if (err) throw err;
			if(result.length===0){
				res.redirect('/login')
			}
			else {
				res.redirect('/todo');
			}
		});
	});
});


module.exports = router;
