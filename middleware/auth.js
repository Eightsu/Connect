const jwt = require('jsonwebtoken');;
const config = require('config');


// middleware/auth

module.exports = function (req, res, next) {

	// Get Token from header 
	const token = req.header('x-auth-token');

	//Check if token exists
	if (!token) {
		return res.status(401).json({ msg: 'No token. Authorization denied.' });
	}

	// Verify Token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded.user;
		next();
	} catch (e) { // there is a token, but it's not valid.
		res.status(401).json({ msg: 'token is not valid.' })
	}
}