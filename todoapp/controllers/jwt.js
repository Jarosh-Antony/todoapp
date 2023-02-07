const secret = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');

exports.validate = (req) => {
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
};

exports.tokenize = (payload) => {
	return jwt.sign(payload, secret);
};
