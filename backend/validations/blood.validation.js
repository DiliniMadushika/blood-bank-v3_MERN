import { z } from 'zod';

// Blood Schema Selections
const bloodTypeOptions = ['A', 'B', 'AB', 'O'];
const rhFactorOptions = ['positive', 'negative'];
const receivedMethodOptions = ['donation', 'purchase'];

// Add Blood Schema
export const addBloodSchema = z
	.object({
		bloodType: z.enum(bloodTypeOptions, { message: 'Blood type must be A, B, AB, or O' }),
		rhFactor: z.enum(rhFactorOptions, { message: 'Rh factor must be positive or negative' }),
		quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }),
		receivedMethod: z.enum(receivedMethodOptions, { message: 'Received method must be donation or purchase' }),
		expiryDate: z.date().min(new Date(), { message: 'Expiry Date must be in the future' })
	})
	.strict();

// Update Blood Schema
export const updateBloodSchema = z
	.object({
		bloodType: z.enum(bloodTypeOptions, { message: 'Blood type must be A, B, AB, or O' }).optional(),
		rhFactor: z.enum(rhFactorOptions, { message: 'Rh factor must be positive or negative' }).optional(),
		quantity: z.number().int().positive().optional({ message: 'Quantity must be a positive integer' }),
		receivedMethod: z
			.enum(receivedMethodOptions, { message: 'Received method must be donation or purchase' })
			.optional(),
		expiryDate: z.date().min(new Date(), { message: 'Expiry Date must be in the future' }).optional()
	})
	.strict(false);
