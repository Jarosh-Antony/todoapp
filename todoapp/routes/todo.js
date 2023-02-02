var express = require('express');
var router = express.Router();
const client = require('../db.js');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const secret = 'secret-key';


var validate=function(req){
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
}

router.get('/', function(req, res, next) {
	let token = req.query.token;
	res.render('todo',{token:token});
});


router.get('/tasks',function(req, res, next){
	
	const v=validate(req);
	if(v.valid){
		var tasks={};
		var query=req.query;
		var sortQ={_id:1};
		
		if(typeof(query.priority)!=="undefined")
			query.priority=parseInt(query.priority);
		
		if(typeof(query.sort)!=="undefined"){
			var QS=query.sort;
			sortQ={};
			if(typeof(query.order)!=="undefined"){
				if(query.order==='ASC')
					ord=1;
				else if(query.order==='DESC')
					ord=-1;
				
				sortQ[QS]=ord;
				delete query.order;
			}
			else 
				sortQ[QS]=1;
			delete query.sort;
		}
		
		if(query.status==='Deleted')
			delete query.status;
		
		if(typeof(query.status)==='undefined'){
			query.status={$ne: "Deleted" };
		}
		
		query.id=v.id;
		
		try{
			client.connect(err => {
				if (err) {
					console.error(err);
					return res.status(500).send({ error: 'Internal Server Error' });
				}
				const db = client.db('todo');
				db.collection('Tasks').find(query).sort(sortQ).toArray()
				.then(result => {
					tasks={'tasks':result};
					res.status(200).json(tasks);
				})
				.catch(err => {
					console.error(err);
					res.status(500).send({ error: 'Internal Server Error' });
				});
			});
		}catch(error){
			console.error(error);
			res.status(500).send({ error: 'Internal Server Error' });
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token' });
});


router.post('/tasks/create',function(req, res, next){
	
	const v=validate(req);
	if(v.valid){
		task=req.body;
		if(task.name.length===0 && task.priority.length===0)
			res.status(400).send({ error: 'Input cannot be empty'});
		else{
			task['id']=v.id;
			task['priority']=parseInt(task['priority'])
			task['status']='Incomplete';
			try{
				client.connect(err => {
					if (err){
						console.error(err);
						return res.status(500).send({ error: 'Internal Server Error' });
					}
					const db = client.db('todo');
					db.collection('Tasks').insertOne(task)
					.then(result => {
						res.status(201).send({message:'Successfully added'});
					})
					.catch(err => {
						console.error(err);
						return res.status(500).send({ error: 'Internal Server Error' });
					});
				});
			}catch(error){
				console.error(error);
				res.status(500).send({ error: 'Internal Server Error' });
			}
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token'});
});


router.put('/tasks/update',function(req, res, next){
	const v=validate(req);
	if(v.valid){
	
		task=req.body;
		try{
			client.connect(err => {
				if (err){
					console.error(err);
					return res.status(500).send({ error: 'Internal Server Error' });
				}
				const db = client.db('todo');
				db.collection("Tasks").updateOne({ _id: new ObjectID(task._id),id:v.id }, { $set: { status: task.status } })
				.then(result => {
					res.status(200).send({message:'Successfully updated'});
				})
				.catch(err => {
					console.error(err);
					return res.status(500).send({ error: 'Internal Server Error' });
				});
			});
		}catch(error){
			console.error(error);
			return res.status(500).send({ error: 'Internal Server Error' });
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token'});
});


router.delete('/tasks/delete',function(req, res, next){
	const v=validate(req);
	if(v.valid){
		
		task=req.body;
		try{
			client.connect(err => {
				if (err){
					console.error(err);
					return res.status(500).send({ error: 'Internal Server Error' });
				}
				const db = client.db('todo');
				db.collection("Tasks").deleteOne({ _id: new ObjectID(task._id),id:v.id })
				.then(result => {
					
					
					db.collection("Tasks").updateOne({ status:'Deleted' },  { $inc: { count: 1 } })
					.then(result => {
						res.status(200).send({message:'Successfully removed'});
					})
					.catch(err => {
						console.error(err);
						return res.status(500).send({ error: 'Internal Server Error' });
					});
					
				})
				.catch(err => {
					console.error(err);
					return res.status(500).send({ error: 'Internal Server Error' });
				});
			});
		}catch(error){
			console.error(error);
			res.status(500).send({ error: 'Internal Server Error' });
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token'});
});



module.exports = router;
