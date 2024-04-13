import { ZodError } from 'zod';

import RequestSchema from '../models/request.model.js';
import { addRequestSchema, updateRequestSchema } from '../validations/request.validation.js';
import BloodSchema from '../models/blood.model.js';

// Add Blood request
export async function addRequest(req, res) {
	try {
		// Extract data from request body
		const parsedData = req.body;

		// Convert expiryDate string to Date object
		parsedData.numberOfUnits = parseInt(parsedData.numberOfUnits);

		// Parse and validate data against the Zod schema
		const { requestHospitalName, bloodType, rhFactor, numberOfUnits, physicianName, physicianPhone, priority, note } =
			addRequestSchema.parse(parsedData);

		// Create a new RequestSchema object
		const newRequest = new RequestSchema({
			requestHospitalName,
			bloodType,
			rhFactor,
			numberOfUnits,
			physicianName,
			physicianPhone,
			priority,
			note
		});

		// Save the new RequestSchema object to the database
		await newRequest.save();

		res.status(200).send({ msg: 'Request added successfully' });
	} catch (error) {
		// Handle Zod validation errors
		if (error instanceof ZodError) {
			res.status(400).send({ errors: error.issues });
		} else {
			console.log(error);
			res.status(500).send({ msg: "Internal Server Error: Couldn't Submit request" });
		}
	}
}

// Display Request Data
export async function getRequestedData(req, res) {
	try {
		// Find all requests in the database
		const requests = await RequestSchema.find();

		// Send the response
		res.status(200).send(requests);
	} catch (error) {
		res.status(500).send({ msg: "Internal Server Error: Couldn't Fetch requests" });
	}
}

// Display Request Data by ID
export async function getRequestedDataById(req, res) {
	try {
		const { id } = req.params;
		// Fetch all blood data from the database
		const requestData = await RequestSchema.findById(id);

		// Send the fetched data as a response
		res.status(200).send({
			msg: 'Request data retrieved successfully!',
			request: requestData
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Internal Server Error: Couldn't Retrieve Data from Requests" });
	}
}

// Get Requests count by Status
export async function getRequestCountByStatus(req, res) {
	try {
		// Find all requests in the database
		const requests = await RequestSchema.find();

		// Calculate the count of requests by status
		const count = requests.reduce((acc, curr) => {
			acc[curr.status] = (acc[curr.status] || 0) + 1;

			// Total Requests
			acc['total'] = (acc['total'] || 0) + 1;
			console.log(acc);

			return acc;
		}, {});

		// Send the response
		res.status(200).send(count);
	} catch (error) {
		res.status(500).send({ msg: "Internal Server Error: Couldn't Fetch requests" });
	}
}

// Update Request Data
export async function updateRequestedData(req, res) {
	try {
		const { id } = req.params;

		// Find the request by ID and update it
		const request = await RequestSchema.findById(id);
		if (!request) {
			return res.status(404).send({ msg: 'Request not found' });
		} else {
			const parsedData = req.body;
			// const updatedData = updateRequestSchema.parse(parsedData);
			// Parse and validate data against the Zod schema
			const { category, status, note } = updateRequestSchema.parse(parsedData);

			const updatedRequest = await RequestSchema.findByIdAndUpdate(id, {
				category,
				status,
				note
			});

			res.status(200).send({ msg: 'Request updated successfully', data: updatedRequest });
		}
	} catch (error) {
		// Handle Zod validation errors
		if (error instanceof ZodError) {
			res.status(400).send({ errors: error.issues });
		} else {
			console.log(error);
			res.status(500).send({ msg: "Internal Server Error: Couldn't Update request" });
		}
	}
}

// Check Stock before the approval
export async function checkStock(req, res) {
	try {
		// Get the blood type and rhFactor from the request body
		const { bloodType, rhFactor, numberOfUnits } = req.body;

		// Find all blood data in the database
		const bloodData = await BloodSchema.find({ bloodType, rhFactor });

		if (!bloodData) {
			return res.status(404).send({ msg: 'Blood data not found' });
		}

		// Calculate the total quantity of blood units
		const totalQuantity = bloodData.reduce((acc, curr) => acc + curr.quantity, 0);

		// Send the response
		res.status(200).send({ total: totalQuantity });
	} catch (error) {
		res.status(500).send({ msg: "Internal Server Error: Couldn't Check Stock" });
	}
}

// Delete Request Data
export async function deleteRequest(req, res) {
	try {
		const { id } = req.params;

		// Find the request by ID and delete it
		const requestData = await RequestSchema.findById(id);

		// Check if request exists
		if (requestData) {
			const request = await RequestSchema.findByIdAndDelete(id);

			res.status(200).send({ msg: 'Request deleted successfully', data: request });
		} else {
			res.status(404).send({ msg: 'Request not found' });
		}
	} catch (error) {
		res.status(500).send({ msg: "Internal Server Error: Couldn't Delete request" });
	}
}
