import axios from 'axios';
import requestAuth from './requestAuth';

import ENV from '../configs';

// Set the base URL for the axios requests
axios.defaults.baseURL = ENV.API_URL;

// Get Inventory API
export const getInventoryData = async () => {
	try {
		const response = await axios.get('/inventory', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get Blood by ID API
export const getInventoryDataById = async (id) => {
	try {
		const response = await axios.get(`/inventory/${id}`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get Expire Blood API
export const getExpireData = async () => {
	try {
		const response = await axios.get('/expire', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get Total Blood API
export const getBloodTotalData = async () => {
	try {
		const response = await axios.get('/total', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Get total Blood for Request dashboard
export const getBloodTotalDataR = async () => {
	try {
		const response = await axios.get('/total-r', requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Add Blood API
export const addBlood = async (data) => {
	try {
		const response = await axios.post('/inventory/add', data, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Update Blood API
export const updateInventoryData = async (id, data) => {
	try {
		const response = await axios.put(`/inventory/${id}/update`, data, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Update Stock Balance API
export const updateStockBalance = async (data) => {
	try {
		const response = await axios.put('/stock-update', data, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};

// Delete Blood API
export const deleteInventoryData = async (id) => {
	try {
		const response = await axios.delete(`/inventory/${id}/delete`, requestAuth);
		return response; // Return the response data
	} catch (error) {
		throw error.response; // Throw error response data if request fails
	}
};
