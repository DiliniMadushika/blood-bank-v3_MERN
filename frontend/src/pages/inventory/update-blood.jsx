import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { updateInventoryData, getInventoryDataById } from '../../api/inventoryAPI';

const UpdateBlood = () => {
	const { id } = useParams(); // Get the ID from params
	const [isLoading, setIsLoading] = useState(false);

	// React hook form for form validation
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm();

	// Fetch blood details by ID
	useEffect(() => {
		const fetchBloodDetails = async () => {
			try {
				const response = await getInventoryDataById(id);
				const { bloodType, rhFactor, quantity, receivedMethod, expiryDate } = response.data.data;
				setValue('bloodType', bloodType);
				setValue('rhFactor', rhFactor);
				setValue('quantity', quantity);
				setValue('receivedMethod', receivedMethod);
				setValue('expiryDate', new Date(expiryDate).toISOString().substr(0, 10)); // Format date
			} catch (error) {
				console.error('Error fetching blood details: ', error);
			}
		};
		fetchBloodDetails();
	}, [id, setValue]);

	const onSubmit = async (values) => {
		try {
			setIsLoading(true);
			const response = await updateInventoryData(id, values);
			if (response.status === 200) {
				Swal.fire({
					icon: 'success',
					title: 'Blood Updated Successfully',
					text: 'Blood data has been updated',
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
				title: 'Updating Blood Failed',
				text: error.message || 'Something went wrong!',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container height-100-minus-172'>
			<h1 className='mt-5 mb-4'>Update Inventory Data</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : (
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

					<button className='btn btn-primary m-3 ms-0 border'>Update Data</button>
				</form>
			)}
		</div>
	);
};

export default UpdateBlood;
