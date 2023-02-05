const jwt = require('jsonwebtoken');
const app = require('../app');
const secret = process.env.SECRET_KEY;
const dbOps=require('./dbOps');
const { ObjectID } = require('mongodb');


exports.validate = (req) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return {valid:false};
	}

	try {
		const payload = jwt.verify(token, secret);
		const id=payload.id;
		return {valid:true,id:id};
		
	} catch (error) {
		return {valid:false};
	}
};

tokenize=function(payload){
	return jwt.sign(payload, secret);
};


exports.login = (req, res) => {
	res.render('login',{ hostname: process.env.HOSTNAME });
};


exports.signup = (req, res) => {
	res.render('signup',{ hostname: process.env.HOSTNAME });
};


exports.api_login = (req, res) => {
	
	dbOps.findOne('Users',req.body)
	.then(result => {
		if(result===null || result.length===0){
			res.status(401).render('login',{error:'Unauthorized'});
		}
		else {
			const token = tokenize({ id:result._id });
			res.status(200).json({token:token});
		}
	})
	.catch(err => {
		console.error(err);
		return res.status(500).send({ error: 'Internal Server Error' });
	});
};


exports.api_signup = (req, res) => {
	dbOps.insertOne('Users',req.body)
	.then(result => {
		
		const insertedId = result.insertedId;
		const id = insertedId.toString();
		
		dbOps.insertOne('Tasks',{count:0, status:'Deleted', id:id})
		.then(result => {
			
			const token = tokenize({ id:id });
			res.status(200).json({token:token});
		})
	})
	.catch(err => {
		console.error(err);
		return res.status(500).send({ error: 'Internal Server Error' });
	});
};



