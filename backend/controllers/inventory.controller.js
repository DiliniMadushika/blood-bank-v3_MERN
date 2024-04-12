import { ZodError } from 'zod';
import BloodSchema from '../models/blood.model.js';
import { addBloodSchema, updateBloodSchema } from '../validations/blood.validation.js';

// Add Blood to Inventory
export async function addToInventory(req, res) {
	try {
		// Parse JSON data from request body
		const parsedData = req.body;

		// Convert expiryDate string to Date object
		parsedData.expiryDate = new Date(parsedData.expiryDate);
		parsedData.quantity = parseInt(parsedData.quantity);

		// Parse and validate data against the Zod schema
		const { bloodType, rhFactor, quantity, receivedMethod, expiryDate } = addBloodSchema.parse(parsedData);

		// Create a new BloodSchema object
		const newBlood = new BloodSchema({
			bloodType,
			rhFactor,
			quantity,
			receivedMethod,
			expiryDate
		});

		// Save the new BloodSchema object to the database
		await newBlood.save();

		res.status(200).send({ msg: 'Data added to inventory' });
	} catch (error) {
		// Handle parsing errors
		if (error instanceof SyntaxError) {
			res.status(400).send({ msg: 'Invalid JSON data' });
			return;
		}

		// Handle Zod validation errors
		if (error instanceof ZodError) {
			res.status(400).send({ errors: error.issues });
		} else {
			res.status(500).send({ msg: "Internal Server Error: Couldn't Insert Data to Inventory" });
		}
	}
}

// Get Inventory Data
export async function getAllInventoryData(req, res) {
	try {
		// Filter data
		const filter = {};

		// Fetch all blood data from the database
		const bloodData = await BloodSchema.find(filter);

		// Send the fetched data as a response
		res.status(200).send({
			msg: 'Blood data retrieved successfully!',
			data: bloodData
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Internal Server Error: Couldn't Retrieve Data from Inventory" });
	}
}

// Get Blood Data from ID
export async function getDataById(req, res) {
	try {
		const { id } = req.params;
		// Fetch all blood data from the database
		const bloodData = await BloodSchema.findById(id);

		// Send the fetched data as a response
		res.status(200).send({
			msg: 'Blood data retrieved successfully!',
			data: bloodData
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Internal Server Error: Couldn't Retrieve Data from Inventory" });
	}
}

// Get Expired Blood Data
export async function getExpireData(req, res) {
	try {
		// Fetch all blood data from the database
		const bloodData = await BloodSchema.find();

		// Get current date
		const currentDate = new Date();

		// Calculate expired blood data and total
		const expiredBlood = bloodData.filter((blood) => blood.expiryDate < currentDate);
		const expiredTotal = expiredBlood.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate short expiry blood data and total (expires within the next 30 days)
		const shortExpiryBlood = bloodData.filter((blood) => {
			const expiryDate = new Date(blood.expiryDate);
			const timeDifference = expiryDate.getTime() - currentDate.getTime();
			const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
			return daysDifference <= 3 && daysDifference > 0; // Expires within the next 30 days
		});
		const shortExpiryTotal = shortExpiryBlood.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate Total blood
		const goodBlood = bloodData.reduce((acc, blood) => acc + blood.quantity, 0);

		// Healthy blood
		const goodTotal = goodBlood - expiredTotal - shortExpiryTotal;

		// Calculate the sum of expired, short expiry, and healthy blood totals
		const total = expiredTotal + shortExpiryTotal + goodTotal;

		// Send the fetched data as a response
		res.status(200).send({
			msg: 'Blood data retrieved successfully!',
			expired: expiredTotal,
			short: shortExpiryTotal,
			good: goodTotal,
			total: total // Include the total in the response
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Internal Server Error: Couldn't Retrieve Data from Inventory" });
	}
}

// Get Blood Total Data
export async function getBloodTotalData(req, res) {
	try {
		// Fetch all blood data from the database
		const bloodData = await BloodSchema.find();

		// Calculate A+ blood total
		const aPositive = bloodData.filter((blood) => blood.bloodType === 'A' && blood.rhFactor === 'positive');
		const aPositiveTotal = aPositive.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate A- blood total
		const aNegative = bloodData.filter((blood) => blood.bloodType === 'A' && blood.rhFactor === 'negative');
		const aNegativeTotal = aNegative.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate B+ blood total
		const bPositive = bloodData.filter((blood) => blood.bloodType === 'B' && blood.rhFactor === 'positive');
		const bPositiveTotal = bPositive.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate B- blood total
		const bNegative = bloodData.filter((blood) => blood.bloodType === 'B' && blood.rhFactor === 'negative');
		const bNegativeTotal = bNegative.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate AB+ blood total
		const abPositive = bloodData.filter((blood) => blood.bloodType === 'AB' && blood.rhFactor === 'positive');
		const abPositiveTotal = abPositive.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate AB- blood total
		const abNegative = bloodData.filter((blood) => blood.bloodType === 'AB' && blood.rhFactor === 'negative');
		const abNegativeTotal = abNegative.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate O+ blood total
		const oPositive = bloodData.filter((blood) => blood.bloodType === 'O' && blood.rhFactor === 'positive');
		const oPositiveTotal = oPositive.reduce((acc, blood) => acc + blood.quantity, 0);

		// Calculate O- blood total
		const oNegative = bloodData.filter((blood) => blood.bloodType === 'O' && blood.rhFactor === 'negative');
		const oNegativeTotal = oNegative.reduce((acc, blood) => acc + blood.quantity, 0);

		// Total Blood
		const totalBlood = bloodData.reduce((acc, blood) => acc + blood.quantity, 0);

		// Send the fetched data as a response
		res.status(200).send({
			msg: 'Boold data retrieved successfully!',
			aPositiveTotal: aPositiveTotal,
			aNegativeTotal: aNegativeTotal,
			bPositiveTotal: bPositiveTotal,
			bNegativeTotal: bNegativeTotal,
			abPositiveTotal: abPositiveTotal,
			abNegativeTotal: abNegativeTotal,
			oPositiveTotal: oPositiveTotal,
			oNegativeTotal: oNegativeTotal,
			totalBlood: totalBlood
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Internal Server Error: Couldn't Retrieve Data from Inventory" });
	}
}

// Update Inventory Data
export async function updateInventoryData(req, res) {
	try {
		// Get Blood ID from URL parameters (assuming it's in params)
		const { id } = req.params;

		// Check if ID is a valid
		const bloodData = await BloodSchema.findById(id);
		if (!bloodData) {
			return res.status(404).json({ message: 'Blood data not found' });
		} else {
			// Extract data from request body
			const parsedData = req.body;

			// Convert expiryDate string to Date object
			parsedData.expiryDate = new Date(parsedData.expiryDate);
			parsedData.quantity = parseInt(parsedData.quantity);

			// Parse and validate data against the Zod schema
			const { bloodType, rhFactor, quantity, receivedMethod, expiryDate } = updateBloodSchema.parse(parsedData);

			// Update Blood document
			const updatedBlood = await BloodSchema.findByIdAndUpdate(id, {
				bloodType,
				rhFactor,
				quantity,
				receivedMethod,
				expiryDate
			});

			// Check if document was updated (optional)
			if (!updatedBlood) {
				return res.status(404).json({ message: 'Blood data not Updated' });
			}

			// Respond with success message and optionally the updated data
			res.status(200).json({ message: 'Data updated successfully!', data: updatedBlood });
		}
	} catch (error) {
		// Handle parsing errors
		if (error instanceof SyntaxError) {
			res.status(400).json({ message: 'Invalid JSON data' });
		}
		// Handle Zod validation errors
		if (error instanceof ZodError) {
			res.status(400).json({ errors: error.issues });
		} else {
			res.status(500).json({ message: "Internal Server Error: Couldn't Update Data in Inventory" });
		}
	}
}

// Delete Blood from Inventory
export async function deleteBlood(req, res) {
	try {
		// Get Blood ID from URL parameters
		const { id } = req.params;

		// Check if ID is a valid
		const bloodData = await BloodSchema.findById(id);

		if (!bloodData) {
			return res.status(404).json({ message: 'Blood data not found' });
		} else {
			// Delete Blood document
			await BloodSchema.findByIdAndDelete(id);

			// Respond with success message
			res.status(200).json({ message: 'Data deleted successfully!' });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error: Couldn't Delete Data from Inventory" });
	}
}
