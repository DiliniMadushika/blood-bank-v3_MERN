import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to check if the user is authenticated as a user
export async function AuthUser(req, res, next) {
	try {
		// Get the token from the request header
		const token = req.headers.authorization.split(' ')[1];

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check Special role access
		if (decoded.userRole !== 'user') {
			return res.status(401).json({
				msg: 'Access denied'
			});
		}

		// Attach the user to the request object
		req.user = decoded;

		// Move to the next middleware
		next();
	} catch (error) {
		return res.status(401).json({
			msg: 'Authentication failed'
		});
	}
}

// Middleware to check if the user is authenticated as an inventory manager
export async function AuthInventory(req, res, next) {
	try {
		// Get the token from the request header
		const token = req.headers.authorization.split(' ')[1];

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check Special role access
		if (decoded.userRole !== 'inventoryManager') {
			return res.status(401).json({
				msg: 'Access denied'
			});
		}

		// Attach the user to the request object
		req.user = decoded;

		// Move to the next middleware
		next();
	} catch (error) {
		return res.status(401).json({
			msg: 'Authentication failed'
		});
	}
}

// Middleware to check if the user is authenticated as a request manager
export async function AuthRequest(req, res, next) {
	try {
		// Get the token from the request header
		const token = req.headers.authorization.split(' ')[1];

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check Special role access
		if (decoded.userRole !== 'requestManager') {
			return res.status(401).json({
				msg: 'Access denied'
			});
		}

		// Attach the user to the request object
		req.user = decoded;

		// Move to the next middleware
		next();
	} catch (error) {
		return res.status(401).json({
			msg: 'Authentication failed'
		});
	}
}
