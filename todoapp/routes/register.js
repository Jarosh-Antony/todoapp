var express = require('express');
var router = express.Router();
const client = require('../db.js');
const jwt = require('jsonwebtoken');
const secret = 'secret-key';


router.get('/', function(req, res, next) {
	res.render('register');
});


router.post('/', function(req, res, next) {
	client.connect(err => {
		if (err) {
			console.error(err);
			return res.status(500).send({ error: 'Internal Server Error' });
		}
		const db = client.db('todo');
		
		db.collection('Users').insertOne(req.body)
		.then(result => {
			
			const insertedId = result.insertedId;
			const id = insertedId.toString();
			
			db.collection('Tasks').insertOne({count:0, status:'Deleted', id:id})
			.then(result => {
				
				const payload = {
					id:id,
				};
				
				console.log(payload.id);
				const token = jwt.sign(payload, secret);
				
				
				res.redirect(`/todo?token=${token}`);
			})
		})
		.catch(err => {
			console.error(err);
			return res.status(500).send({ error: 'Internal Server Error' });
		});
	});
});

module.exports = router;
