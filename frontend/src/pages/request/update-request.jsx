import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { getRequestDataById, updateRequestData, checkStock } from '../../api/requestAPI';

const UpdateRequest = () => {
	const { id } = useParams(); // Get the ID from params
	const [stockEnough, setStockEnough] = useState(true);

	// React hook form for form validation
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm();

	// Fetch request details by ID
	useEffect(() => {
		const fetchRequestDetails = async () => {
			try {
				const response = await getRequestDataById(id);
				const requestData = response.data.request;
				const stock = await checkStock(requestData);

				setValue('requestHospitalName', requestData.requestHospitalName);
				setValue('physicianName', requestData.physicianName);
				setValue('physicianPhone', requestData.physicianPhone);
				setValue('bloodType', requestData.bloodType);
				setValue('rhFactor', requestData.rhFactor);
				setValue('numberOfUnits', requestData.numberOfUnits);
				setValue('stockUnits', stock.data.total);
				setValue('priority', requestData.priority);
				setValue('category', requestData.category);
				setValue('status', requestData.status);
				setValue('note', requestData.note);

				// Check if stock is enough
				if (stock.data.total < requestData.numberOfUnits) {
					setStockEnough(false);
				}
			} catch (error) {
				console.error('Error fetching request details: ', error);
			}
		};
		fetchRequestDetails();
	}, [id, setValue]);

	const onSubmit = async (data) => {
		try {
			await updateRequestData(id, data);
			Swal.fire({
				icon: 'success',
				title: 'Request Updated Successfully',
				text: 'Request data has been updated',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			}).then(() => {
				window.location.href = '/';
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Updating Request Failed',
				text: error.message || 'Something went wrong!',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			});
		}
	};

	return (
		<div className='container mb-5'>
			<form className='container w-75' onSubmit={handleSubmit(onSubmit)}>
				<h2 className='mt-5 mb-4'>Request Blood</h2>
				<div className='mb-3'>
					<label className='form-label'>Hospital Name</label>
					<input
						disabled
						type='text'
						className='form-control'
						{...register('requestHospitalName', { required: true })}
					/>
					{errors.requestHospitalName && <span className='text-danger'>Hospital Name is required</span>}
				</div>
				<div className='row'>
					<div className='mb-3 col'>
						<label className='form-label'>Name of the Physician</label>
						<input
							disabled
							type='text'
							className='form-control'
							{...register('physicianName', { required: true })}
						/>
						{errors.physicianName && <span className='text-danger'>Physician Name is required</span>}
					</div>
					<div className='mb-3 col'>
						<label className='form-label'>Contact Number</label>
						<input
							disabled
							type='text'
							className='form-control'
							{...register('physicianPhone', { required: true, pattern: /^\d+$/, minLength: 10 })}
						/>
						{errors.physicianPhone && <span className='text-danger'>Contact Number is required</span>}
					</div>
				</div>
				<div className='row'>
					<div className='mb-3 col'>
						<label className='form-label'>Blood Type</label>
						<select disabled className='form-select' {...register('bloodType', { required: true })}>
							<option value=''>Select Blood Type</option>
							<option value='A'>A</option>
							<option value='B'>B</option>
							<option value='O'>O</option>
							<option value='AB'>AB</option>
						</select>
						{errors.bloodType && <span className='text-danger'>Blood Type is required</span>}
					</div>
					<div className='mb-3 col'>
						<label className='form-label'>Rh Factor</label>
						<select disabled className='form-select' {...register('rhFactor', { required: true })}>
							<option value=''>Select Rh Factor</option>
							<option value='positive'>Positive (+)</option>
							<option value='negative'>Negative (-)</option>
						</select>
						{errors.rhFactor && <span className='text-danger'>Rh Factor is required</span>}
					</div>
				</div>

				<div className='row'>
					<div className='mb-3 col'>
						<label className='form-label'>Level of Priority</label>
						<select disabled className='form-select' {...register('priority', { required: true })}>
							<option value=''>Select Priority</option>
							<option value='Low'>Low</option>
							<option value='Normal'>Normal</option>
							<option value='High'>High</option>
						</select>
						{errors.priority && <span className='text-danger'>Priority is required</span>}
					</div>
					<div className='col'></div>
				</div>
				<div className='row'>
					<div className='mb-3 col'>
						<label className='form-label'>Requested Qty (in Pints)</label>
						<input
							disabled
							type='number'
							className='form-control'
							{...register('numberOfUnits', {
								required: true,
								min: 1,
								pattern: /^\d+$/,
								onChange: (event) => {
									const input = event.target;
									const newValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
									input.value = newValue;
								}
							})}
						/>
						{errors.numberOfUnits && <span className='text-danger'>Quantity must be at least 1</span>}
					</div>
					<div className='mb-3 col'>
						<label className='form-label'>Available Qty</label>
						<input disabled type='number' className='form-control' {...register('stockUnits', {})} />
					</div>
				</div>
				<div className='row'>
					<div className='mb-3 col'>
						<label className='form-label'>Category</label>
						<select className='form-select' {...register('category', { required: true })}>
							<option value=''>-- Select Category --</option>
							<option value='single'>Single</option>
							<option value='bulk'>Bulk</option>
						</select>
						{errors.category && <span className='text-danger'>Category is required</span>}
					</div>
					<div className='mb-3 col'>
						<label className='form-label'>Status</label>
						<select className='form-select' {...register('status', { required: true })}>
							<option value=''>-- Select Status --</option>
							<option value='pending'>Pending</option>
							<option value='approved'>Approved</option>
							<option value='rejected'>Rejected</option>
						</select>
						{errors.status && <span className='text-danger'>Status is required</span>}
					</div>
					<div className='mb-3'>
						<label className='form-label'>Note</label>
						<textarea className='form-control' {...register('note', { required: false })}></textarea>
						{errors.note && <span className='text-danger'>Note is required</span>}
					</div>
				</div>
				{stockEnough ? (
					<input type='submit' className='btn btn-primary' value='Update' />
				) : (
					<button type='button' className='btn btn-warning' onClick={() => window.history.back()}>
						Back (Not Enough Stock)
					</button>
				)}
			</form>
		</div>
	);
};

export default UpdateRequest;
