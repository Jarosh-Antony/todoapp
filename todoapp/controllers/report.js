const auth = require('./auth');
const dbOps=require('./dbOps');
const app = require('../app');

exports.index = (req, res) => {
	let token = req.query.token;
	res.render('report',{token:token, hostname: process.env.HOSTNAME});
};


exports.count = (req, res) => {
	const v=auth.validate(req);
	if(v.valid){
		
		var id=v.id;
		var query=req.query;
		var counts={success:true,count:[]};
		if(query.Status===undefined){
			try{
				dbOps.aggregator('Tasks',id)
				.then(result => result.toArray())
				.then(result => {
					counts.count=result;
					dbOps.findOne('Tasks',{id:id,status:"Deleted"})
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
						
						output={'success':true,'count':{}};
						for(i of counts.count){
							output.count[i._id]=i.count;
						}
						
						res.status(200).json(output);
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
		else {
			try{
				if(query.Status==="Deleted"){
					dbOps.findOne('Tasks',{id:id, status:"Deleted"})
					.then(result => {
						counts.count=result.count;
						res.status(200).json(counts);
					})
					.catch(err => {
						throw err
					});
				}
				else {
					query.id=id;
					dbOps.countDocuments('Tasks',query)
					.then(result => {
						counts.count=result;
						res.status(200).json(counts);
					})
					.catch(err => {
						throw err
					});
				}
			}catch(error){
				console.error(error);
				res.status(500).send({ error: 'Internal Server Error' });
			}
		}
	}
	else 
		res.status(401).send({ error: 'Invalid token' });
};

