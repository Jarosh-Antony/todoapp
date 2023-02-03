const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/todo';
const { ObjectID } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true });

exports.get= (req, res) => {
	let token = req.query.token;
	res.render('report',{token:token});
};

const db = client.db('todo');


exports.aggregator = function(collection, id) {
	return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err)
				reject(err);
			else{
				result=db.collection(collection).aggregate([
					{ $match: {id: id} },
					{ $group: { _id: "$status", count: { $sum: 1 }}}
				]);
				resolve(result);
			}
		});
	});
};


exports.findOne = function(collection,query) {
	return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err) 
				reject(err);
			else
				resolve(db.collection(collection).findOne(query));
		});
	});
};


exports.find = function(collection,query) {
	return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err) 
				reject(err);
			else
				resolve(db.collection(collection).find(query));
		});
	});
};



exports.countDocuments = function(collection,query) {
	return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err) 
				reject(err);
			else {
				resolve(db.collection(collection).countDocuments(query));
			}
		});
	});
};


exports.insertOne = function(collection,data) {
	return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err) 
				reject(err);
			else {
				resolve(db.collection(collection).insertOne(data));
			}
		});
	});
};



exports.updateOne = function(collection,toUpdate,updation) {
	return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err) 
				reject(err);
			else {
				resolve(db.collection(collection).updateOne(toUpdate,updation));
			}
		});
	});
};



exports.deleteOne = function(collection,del) {
	return new Promise((resolve, reject) => {
		client.connect(err => {
			if (err) 
				reject(err);
			else {
				resolve(db.collection(collection).deleteOne(del));
			}
		});
	});
};


