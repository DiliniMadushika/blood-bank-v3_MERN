import { z } from 'zod';

const bloodTypeOptions = ['A', 'B', 'AB', 'O'];
const rhFactorOptions = ['positive', 'negative'];
const priorityOptions = ['Low', 'Normal', 'High'];
const statusOptions = ['pending', 'approved', 'rejected'];

// Add Request Schema (all required fields)
export const addRequestSchema = z.object({
	requestHospitalName: z.string().min(1, { message: 'Name cannot be empty' }),
	bloodType: z.enum(bloodTypeOptions, { message: 'Invalid blood type' }),
	rhFactor: z.enum(rhFactorOptions, { message: 'Invalid Rh factor' }),
	numberOfUnits: z
		.number()
		.positive({ message: 'Number of units must be positive' })
		.nonnegative({ message: 'Number of units cannot be negative' }),
	physicianName: z.string().min(1, { message: 'Physician name is required' }),
	physicianPhone: z.string().min(1, { message: 'Physician phone is required' }),
	priority: z.enum(priorityOptions, { message: 'Invalid priority level' }),
	note: z.string().optional()
});

// Update Request Schema (partial)
export const updateRequestSchema = z.object({
	category: z.enum(['single', 'bulk'], { message: 'Invalid category' }),
	status: z.enum(statusOptions, { message: 'Invalid status' }),
	note: z.string().optional()
});
