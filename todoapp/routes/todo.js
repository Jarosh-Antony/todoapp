var express = require('express');
var router = express.Router();
const client = require('../db.js');
const { ObjectID } = require('mongodb');

router.get('/:userID', function(req, res, next) {
	let userID = req.params.userID;
	res.render('todo',{userID:userID});
});


router.get('/tasks/:userID',function(req, res, next){
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
	query.id=req.params.userID;
	
	try{
		client.connect(err => {
			if (err) throw err;
			const db = client.db('todo');
			db.collection('Tasks').find(query).sort(sortQ).toArray()
			.then(result => {
				tasks={'tasks':result};
				res.json(tasks);
			})
			.catch(err => {
				throw err;
			});
		});
	}catch(error){
		console.error(error);
		res.status(400).send('');
	}
});


router.post('/tasks',function(req, res, next){
	task=req.body;
	if(task.name.length===0 && task.priority.length===0)
		res.status(400).send('Input cannot be empty');
	else{
		task['priority']=parseInt(task['priority'])
		task['status']='Incomplete';
		try{
			client.connect(err => {
				if (err) throw err;
				const db = client.db('todo');
				db.collection('Tasks').insertOne(task)
				.then(result => {
					res.status(201).send('Successfully added');
				})
				.catch(err => {
					throw err;
				});
			});
		}catch(error){
			console.error(error);
			res.status(400).send('');
		}
	}
});


router.put('/tasks',function(req, res, next){
	task=req.body;
	try{
		client.connect(err => {
			if (err) throw err;
			const db = client.db('todo');
			db.collection("Tasks").updateOne({ _id: new ObjectID(task._id) }, { $set: { status: task.status } })
			.then(result => {
				res.status(200).send('Successfully updated');
			})
			.catch(err => {
				throw err;
			});
		});
	}catch(error){
		console.error(error);
		res.status(400).send('');
	}
});


router.delete('/tasks',function(req, res, next){
	task=req.body;
	try{
		client.connect(err => {
			if (err) throw err;
			const db = client.db('todo');
			db.collection("Tasks").deleteOne({ _id: new ObjectID(task._id) })
			.then(result => {
				
				
				db.collection("Tasks").updateOne({ _id: new ObjectID('63d8f1c16821d863137c6ed3') },  { $inc: { count: 1 } })
				.then(result => {
					res.status(200).send('Successfully removed');
				})
				.catch(err => {
					throw err;
				});
				
			})
			.catch(err => {
				throw err;
			});
		});
	}catch(error){
		console.error(error);
		res.status(400).send('');
	}
});



module.exports = router;
