import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './util/db-connection.js';
import router from './routes/router.js';
dotenv.config();

const PORT = process.env.SERVER_PORT || 5001;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// HTTP get request
app.get('/', (req, res) => {
	res.status(200).json('Backend is running...');
});

// API routes
app.use('/api', router);

// Start the server
try {
	if ((await connectDB()) === true) {
		try {
			app.listen(PORT, () => {
				console.log(`Server is running on port ${PORT}`);
			});
		} catch (error) {
			console.log("Server couldn't start: ");
		}
	} else {
		console.log('Server cannot start without database connection');
	}
} catch (error) {
	console.log('Cannot connect to MongoDB');
}
