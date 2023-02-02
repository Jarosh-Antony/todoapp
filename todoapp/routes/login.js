var express = require('express');
var router = express.Router();
const client = require('../db.js');
const jwt = require('jsonwebtoken');
const secret = 'secret-key';


router.get('/', function(req, res, next) {
	res.render('login');
});


router.post('/', function(req, res, next) {
	client.connect(err => {
		if (err) throw err;
		const db = client.db('todo');
		db.collection('Users').findOne(req.body)
		.then(result => {
			if(result===null || result.length===0){
				res.status(401).render('login',{error:'Unauthorized'});
			}
			else {
				
				
				const payload = {
					id:result._id,
				};
				
				console.log(payload.id);
				const token = jwt.sign(payload, secret);
				
				
				res.redirect(`/todo?token=${token}`);
			}
		})
		.catch(err => {
			throw err;
		});
	});
});


module.exports = router;
