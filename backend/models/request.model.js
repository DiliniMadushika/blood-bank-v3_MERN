import mongoose from 'mongoose';

export const RequestSchema = new mongoose.Schema(
	{
		requestHospitalName: {
			type: String,
			required: true
		},
		bloodType: {
			type: String,
			required: true,
			enum: ['A', 'B', 'AB', 'O']
		},
		rhFactor: {
			type: String,
			required: true,
			enum: ['positive', 'negative']
		},
		numberOfUnits: {
			type: Number,
			required: true,
			min: 1
		},
		physicianName: {
			type: String,
			required: true
		},
		physicianPhone: {
			type: String,
			required: true
		},
		priority: {
			type: String,
			required: true,
			enum: ['Low', 'Normal', 'High']
		},
		category: {
			type: String,
			required: false,
			enum: ['single', 'bulk', 'none'],
			default: 'none'
		},
		status: {
			type: String,
			required: true,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending'
		},
		note: {
			type: String,
			optional: true,
			default: '-'
		}
	},
	{
		timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 }
	}
);

export default mongoose.model('Request', RequestSchema);
