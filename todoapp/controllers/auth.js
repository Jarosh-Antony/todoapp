const app = require('../app');
const dbOps=require('./dbOps');
const jwt=require('./jwt');
const { ObjectID } = require('mongodb');


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
			res.status(401).send();
		}
		else {
			const token = jwt.tokenize({ id:result._id });
			res.status(200).json({token:token});
		}
	})
	.catch(err => {
		console.error(err);
		return res.status(500).send();
	});
};


exports.api_signup = (req, res) => {
	dbOps.insertOne('Users',req.body)
	.then(result => {
		
		const insertedId = result.insertedId;
		const id = insertedId.toString();
		
		dbOps.insertOne('Tasks',{count:0, status:'Deleted', id:id})
		.then(result => {
			
			const token = jwt.tokenize({ id:id });
			res.status(201).json({token:token});
		})
	})
	.catch(err => {
		console.error(err);
		return res.status(500).send();
	});
};

