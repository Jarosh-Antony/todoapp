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
	res.render('report',{token:token});
});


router.get('/count',function(req, res, next){
	const v=validate(req);
	if(v.valid){
		
		var id=v.id;
		var query=req.query;
		var counts={count:[]};
		if(Object.keys(query).length === 0){
			try{
				client.connect(err => {
					if (err) {
						console.error(err);
						res.status(500).send({ error: 'Internal Server Error' });
					}
					const db = client.db('todo');
					db.collection('Tasks').aggregate([
						{
							$match: {
								id: id
							},
						},
						{
							$group: {
								_id: "$status",
								count: { $sum: 1 }
							}
						}
					]).toArray()
					.then(result => {
						counts.count=result;
						db.collection('Tasks').findOne({id:id,status:"Deleted"})
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
							
							res.status(200).json(counts);
						})
						.catch(err => {
							console.error(err);
							res.status(500).send({ error: 'Internal Server Error' });
						});
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
		else {
			try{
				client.connect(err => {
					if (err){
						console.error(err);
						res.status(500).send({ error: 'Internal Server Error' });
					}
					const db = client.db('todo');
					if(query.Status==="Deleted"){
						db.collection('Tasks').findOne({id:id, status:"Deleted"})
						.then(result => {
							counts.count=result.count;
							res.status(200).json(counts);
						})
						.catch(err => {
							console.error(err);
							res.status(500).send({ error: 'Internal Server Error' });
						});
					}
					else {
						query.id=id;
						db.collection('Tasks').countDocuments(query)
						.then(result => {
							counts.count=result;
							res.status(200).json(counts);
						})
						.catch(err => {
							console.error(err);
							res.status(500).send({ error: 'Internal Server Error' });
						});
					}
				});
			}catch(error){
				console.error(error);
				res.status(500).send({ error: 'Internal Server Error' });
			}
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token' });
});



module.exports = router;
