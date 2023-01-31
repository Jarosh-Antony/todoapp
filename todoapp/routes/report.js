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
	console.log(query);
	var counts={};
	if(Object.keys(query).length === 0){
		try{
			console.log(Object.keys(query));
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
				}).toArray((err, result) => {
					if (err) throw err;
					counts.count=result;
				});
				db.collection('Tasks').findOne({status:"Deleted"},(err, result) => {
					if (err) throw err;
					for(i of counts.count){
						if(i._id==='Deleted')
							i.count=result.count;
					}
					res.json(counts);
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
					db.collection('Tasks').findOne({status:"Deleted"},(err, result) => {
						console.log(result)
						if (err) throw err;
						counts.count=result.count;
						res.json(counts);
					});
				}
				else {
					db.collection('Tasks').countDocuments(query, (err, count) => {
						if (err) throw err;
						counts.count=count;
						res.json(counts);
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
