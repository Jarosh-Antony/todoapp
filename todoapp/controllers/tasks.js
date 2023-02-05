const auth=require('./auth');
const dbOps=require('./dbOps');
const app = require('../app');
const { ObjectID } = require('mongodb');

exports.index = (req, res) => {
	let token = req.query.token;
	res.render('todo',{token:token,hostname: process.env.HOSTNAME});
};


exports.get = (req, res) => {
	
	const v=auth.validate(req);
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
			dbOps.find('Tasks',query)
			.then(unsorted => unsorted.sort(sortQ))
			.then(result => result.toArray())
			.then(result => {
				tasks={'tasks':result};
				res.status(200).json(tasks);
			})
			.catch(err => {
				throw err;
			});
		}catch(error){
			console.error(error);
			res.status(500).send({ error: 'Internal Server Error' });
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token' });
};



exports.create = (req, res) => {
	
	const v=auth.validate(req);
	if(v.valid){
		task=req.body;
		if(task.name.length===0 && task.priority.length===0)
			res.status(400).send({ error: 'Input cannot be empty'});
		else{
			task['id']=v.id;
			task['priority']=parseInt(task['priority'])
			task['status']='Incomplete';
			try{
				dbOps.insertOne('Tasks',task)
				.then(result => {
					res.status(201).send({message:'Successfully added'});
				})
				.catch(err => {
					throw err;
				});
			}catch(error){
				console.error(error);
				res.status(500).send({ error: 'Internal Server Error' });
			}
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token'});
};



exports.update = (req, res) => {
	const v=auth.validate(req);
	if(v.valid){
	
		task=req.body;
		try{
			dbOps.updateOne('Tasks',{ _id: new ObjectID(task._id),id:v.id }, { $set: { status: task.status } })
			.then(result => {
				res.status(200).send({message:'Successfully updated'});
			})
			.catch(err => {
				throw err;
			});
		}catch(error){
			console.error(error);
			return res.status(500).send({ error: 'Internal Server Error' });
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token'});
};




exports.remove = (req, res) => {
	const v=auth.validate(req);
	if(v.valid){
		
		task=req.body;
		try{
			dbOps.deleteOne('Tasks',{ _id: new ObjectID(task._id),id:v.id })
			.then(result => {
				dbOps.updateOne('Tasks',{ id:v.id,status:'Deleted' },  { $inc: { count: 1 } })
				.then(result => {
					res.status(200).send({message:'Successfully removed'});
				})
				.catch(err => {
					throw err;
				});
				
			})
			.catch(err => {
				throw err;
			});
		}catch(error){
			console.error(error);
			res.status(500).send({ error: 'Internal Server Error' });
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token'});
};

