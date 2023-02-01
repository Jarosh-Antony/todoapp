var express = require('express');
var router = express.Router();
const client = require('../db.js');
const { ObjectID } = require('mongodb');

router.get('/:userID', function(req, res, next) {
	let userID = req.params.userID;
	res.render('report',{userID:userID});
});


router.get('/count/:userID',function(req, res, next){
	var id=req.params.userID;
	var query=req.query;
	var counts={count:[]};
	if(Object.keys(query).length === 0){
		try{
			client.connect(err => {
				if (err) throw err;
				const db = client.db('todo');
				db.collection('Tasks').aggregate([
				{
					$group: {
						_id: "$status",
						count: { $sum: 1 }
					}
				}
				], {
					cursor: {}
				}).toArray()
				.then(result => {
					counts.count=result;
					db.collection('Tasks').findOne({status:"Deleted"})
					.then(result => {
						var completed=true;
						var incomplete=true;
						var cancelled=true;
						
						for(i of counts.count){
							if(i._id==='Deleted')
								i.count=result.count;
							else if(i._id==='Completed')
								completed=false;
							else if(i._id==='Incomplete')
								incomplete=false;
							else 
								cancelled=false;
						}
						
						if(completed)
							counts.count.push({'_id':'Completed','count':0});
						if(incomplete)
							counts.count.push({'_id':'Incomplete','count':0});
						if(cancelled)
							counts.count.push({'_id':'Cancelled','count':0});
						
						res.json(counts);
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
	}
	else {
		try{
			client.connect(err => {
				if (err) throw err;
				const db = client.db('todo');
				if(query.Status==="Deleted"){
					db.collection('Tasks').findOne({status:"Deleted"})
					.then(result => {
						counts.count=result.count;
						res.json(counts);
					})
					.catch(err => {
						throw err;
					});
				}
				else {
					db.collection('Tasks').countDocuments(query)
					.then(result => {
						counts.count=result;
						res.json(counts);
					})
					.catch(err => {
						throw err;
					});
				}
			});
		}catch(error){
			console.error(error);
			res.status(400).send('');
		}
	}
});



module.exports = router;
