import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
	{
		fName: {
			type: String,
			required: true
		},
		lName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		userRole: {
			type: String,
			enum: ['inventoryManager', 'requestManager', 'user'],
			default: 'user'
		}
	},
	{
		timestamps: { currentTime: () => Date.now() + 5.5 * 60 * 60 * 1000 }
	}
);

export default mongoose.model('User', UserSchema);
