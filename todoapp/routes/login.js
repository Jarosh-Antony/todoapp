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
				res.render('login');
			}
			else {
				let data = { name: 'John', age: 30 };
				res.redirect('/todo/'+result[0]._id);
			}
		});
	});
});


module.exports = router;
