import mongoose from 'mongoose';

export const BloodSchema = new mongoose.Schema(
	{
		bloodType: {
			type: String,
			enum: ['A', 'B', 'AB', 'O'],
			required: true
		},
		rhFactor: {
			type: String,
			enum: ['positive', 'negative'],
			required: true
		},
		quantity: {
			type: Number,
			required: true,
			min: 1
		},
		receivedMethod: {
			type: String,
			enum: ['donation', 'purchase'],
			required: true
		},
		expiryDate: {
			type: Date,
			required: true
		}
	},
	{
		timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 }
	}
);

export default mongoose.model('Blood', BloodSchema);
