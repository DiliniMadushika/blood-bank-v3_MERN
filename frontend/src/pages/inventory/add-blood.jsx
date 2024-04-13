import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { addBlood } from '../../api/inventoryAPI';

// Function to handle form submission
const onSubmit = async (values) => {
	try {
		const response = await addBlood(values);
		if (response.status === 200) {
			Swal.fire({
				icon: 'success',
				title: 'Blood Added Successfully',
				text: 'Blood has been added to the inventory',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			}).then(() => {
				window.location.href = '/inventory';
			});
		}
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Adding Blood Failed',
			text: error.message || 'Something went wrong!',
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true
		});
	}
};

// Add Blood Component
const AddBlood = () => {
	// React Hook Form
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	return (
		<div className='container height-100-minus-172'>
			<h1 className='mt-5 mb-4'>Add to Inventory</h1>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className='row'>
					<div className='form-group mb-4 col'>
						<label className='mb-2'>Blood Type</label>
						<select {...register('bloodType', { required: true })} className='form-control form-select'>
							<option value=''>-- Select Blood Type --</option>
							<option value='A'>A</option>
							<option value='B'>B</option>
							<option value='AB'>AB</option>
							<option value='O'>O</option>
						</select>
						{errors.bloodType && <span className='error text-danger '>Blood Type is required.</span>}
					</div>
					<div className='form-group mb-4 col'>
						<label className='mb-2'>Rh Factor</label>
						<select {...register('rhFactor', { required: true })} className='form-control form-select'>
							<option value=''>-- Select Rh Factor --</option>
							<option value='positive'>Positive (+)</option>
							<option value='negative'>Negative (-)</option>
						</select>
						{errors.rhFactor && <span className='error text-danger'>Rh Factor is required.</span>}
					</div>
				</div>
				<div className='row'>
					<div className='form-group mb-4 col'>
						<label className='mb-2'>Quantity (in Pints)</label>
						<input
							{...register('quantity', {
								required: true,
								min: 1,
								pattern: /^\d+$/,
								onChange: (event) => {
									const input = event.target;
									const newValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
									input.value = newValue;
								}
							})}
							type='number'
							className='form-control'
							placeholder='Enter Quantity'
						/>
						{errors.quantity && errors.quantity.type === 'required' && (
							<span className='error text-danger'>Quantity is required.</span>
						)}
						{errors.quantity && errors.quantity.type === 'min' && (
							<span className='error text-danger'>Quantity must be at least 1.</span>
						)}
						{errors.quantity && errors.quantity.type === 'pattern' && (
							<span className='error text-danger'>Quantity must be a number.</span>
						)}
					</div>

					<div className='form-group mb-4 col'>
						<label className='mb-2'>Received Method</label>
						<select {...register('receivedMethod', { required: true })} className='form-control form-select'>
							<option value=''>-- Select Received Method --</option>
							<option value='donation'>Donation</option>
							<option value='purchase'>Purchase</option>
						</select>
						{errors.receivedMethod && <span className='error text-danger'>Received Method is required.</span>}
					</div>
				</div>

				<div className='row'>
					<div className='form-group mb-4 col'>
						<label className='mb-2'>Expiry Date</label>
						<input
							{...register('expiryDate', {
								required: true,
								validate: (value) => {
									const selectedDate = new Date(value);
									const today = new Date();
									return selectedDate >= today;
								}
							})}
							type='date'
							className='form-control'
						/>
						{errors.expiryDate && <span className='error text-danger'>Expiry Date is invalid.</span>}
					</div>
					<div className='col'></div>
				</div>

				<button className='btn btn-primary m-3 ms-0 border'>Add Data</button>
			</form>
		</div>
	);
};

export default AddBlood;
