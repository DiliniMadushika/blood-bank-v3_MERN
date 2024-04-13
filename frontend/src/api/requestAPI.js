import axios from 'axios';
import requestAuth from './requestAuth';

import ENV from '../configs';

// Set the base URL for the axios requests
axios.defaults.baseURL = ENV.API_URL;

// Create Request API
export const createRequestData = async (values) => {
	try {
		const response = await axios.post('/requests/add', values, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get Inventory API
export const getRequestData = async () => {
	try {
		const response = await axios.get('/requests', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get Request by ID API
export const getRequestDataById = async (id) => {
	try {
		const response = await axios.get(`/requests/${id}`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Update Request API
export const updateRequestData = async (id, requestData) => {
	try {
		const response = await axios.put(`/requests/${id}/update`, requestData, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Check Stock API
export const checkStock = async (requestData) => {
	try {
		const response = await axios.put('/available', requestData, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Delete Request API
export const deleteRequestData = async (id) => {
	try {
		const response = await axios.delete(`/requests/${id}/delete`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get Blood Request count Data API
export const getRequestCountData = async () => {
	try {
		const response = await axios.get('/count', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};
