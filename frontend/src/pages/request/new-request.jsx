import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { createRequestData } from '../../api/requestAPI';

// On submit function for handle form submission
const onSubmit = async (values) => {
	try {
		const response = await createRequestData(values);
		if (response.status === 200) {
			console.log(response.data);
			Swal.fire({
				icon: 'success',
				title: 'Request Placed Successfully',
				text: 'Blood request has been placed successfully',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			}).then(() => {
				window.location.href = '/';
			});
		}
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Placing Request Failed',
			text: error.message || 'Something went wrong!',
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true
		});
	}
};

const NewRequest = () => {
	// React hook form for form validation
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	return (
		<div className='container height-100-minus-172'>
			<form className='container w-75' onSubmit={handleSubmit(onSubmit)}>
				<h2 className='mt-5 mb-4'>Request Blood</h2>
				<div className='mb-3'>
					<label className='form-label'>Hospital Name</label>
					<input type='text' className='form-control' {...register('requestHospitalName', { required: true })} />
					{errors.requestHospitalName && <span className='text-danger'>Hospital Name is required</span>}
				</div>
				<div className='row'>
					<div className='mb-3 col'>
						<label className='form-label'>Name of the Physician</label>
						<input type='text' className='form-control' {...register('physicianName', { required: true })} />
						{errors.physicianName && <span className='text-danger'>Physician Name is required</span>}
					</div>
					<div className='mb-3 col'>
						<label className='form-label'>Contact Number</label>
						<input
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
						<select className='form-select' {...register('bloodType', { required: true })}>
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
						<select className='form-select' {...register('rhFactor', { required: true })}>
							<option value=''>Select Rh Factor</option>
							<option value='positive'>Positive (+)</option>
							<option value='negative'>Negative (-)</option>
						</select>
						{errors.rhFactor && <span className='text-danger'>Rh Factor is required</span>}
					</div>
				</div>
				<div className='row'>
					<div className='mb-3 col'>
						<label className='form-label'>Quantity (in Pints)</label>
						<input
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
						<label className='form-label'>Level of Priority</label>
						<select className='form-select' {...register('priority', { required: true })}>
							<option value=''>Select Priority</option>
							<option value='Low'>Low</option>
							<option value='Normal'>Normal</option>
							<option value='High'>High</option>
						</select>
						{errors.priority && <span className='text-danger'>Priority is required</span>}
					</div>
				</div>
				<input type='submit' className='btn btn-secondary' value='Request' />
			</form>
		</div>
	);
};

export default NewRequest;
