var express = require('express');
var router = express.Router();
const client = require('../db.js');
const { ObjectID } = require('mongodb');

router.get('/:userID', function(req, res, next) {
	let userID = req.params.userID;
	res.render('todo',{userID:userID});
});


router.get('/tasks/:userID',function(req, res, next){
	var id=req.params.userID;
	var tasks={};
	try{
		client.connect(err => {
			if (err) throw err;
			const db = client.db('todo');
			query={id:id};
			db.collection('Tasks').find(query).sort({ priority: -1}).toArray((err, result) => {
				if (err) throw err;
				tasks={'tasks':result};
				res.json(tasks);
			});
		});
	}catch(error){
		console.error(error);
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
				const result=db.collection('Tasks').insertOne(task);
			});
		}catch(error){
			console.error(error);
		}
		res.status(201).send('Successfully added');
	}
});


router.put('/tasks',function(req, res, next){
	task=req.body;
	try{
		client.connect(err => {
			if (err) throw err;
			const db = client.db('todo');
			db.collection("Tasks").updateOne({ _id: new ObjectID(task._id) }, { $set: { status: task.status } }, (err, result) => {
				if (err) throw err;
			});
		});
	}catch(error){
		console.error(error);
	}
	res.status(200).send('Successfully updated');
});


router.delete('/tasks',function(req, res, next){
	task=req.body;
	try{
		client.connect(err => {
			if (err) throw err;
			const db = client.db('todo');
			const collection = db.collection("Tasks").deleteOne({ _id: new ObjectID(task._id) }, (err, result) => {
				if (err) throw err;
			});
		});
	}catch(error){
		console.error(error);
	}
	res.status(200).send('Successfully removed');
});



module.exports = router;
