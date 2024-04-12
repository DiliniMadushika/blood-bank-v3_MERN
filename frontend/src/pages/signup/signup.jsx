import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { registerUser } from '../../api/userAPI';

const onSubmit = async (values) => {
	try {
		const response = await registerUser(values);
		if (response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Registration Successful',
				text: 'You have successfully registered',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			}).then(() => {
				window.location.href = '/signin';
			});
		}
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Registration Failed',
			text: error.message || 'Something went wrong!',
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true
		});
	}
};

const SignUp = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm();

	const password = watch('password', '');

	const confirmPasswordMatch = (value) => {
		return value === password || ' Passwords do not match';
	};

	return (
		<div className='d-flex justify-content-center align-items-center bg-body height-100-minus-60'>
			<div className='card text-dark bg-body mb-3 w-50'>
				<div className='card-header text-center'>Sign Up</div>
				<div className='card-body'>
					<form className='needs-validation' onSubmit={handleSubmit(onSubmit)}>
						<div className='mt-4 mb-5'>
							<div className='row'>
								<div className='form-group mb-4 col'>
									<label className='mb-2'>First Name</label>
									{errors.fName && <span className='text-danger'>{errors.fName.message}</span>}
									<input
										className='form-control'
										{...register('fName', {
											required: ' ( required )',
											minLength: { value: 3, message: ' ( Least 3 characters long )' }
										})}
									/>
								</div>
								<div className='form-group mb-4 col'>
									<label className='mb-2'>Last Name</label>
									{errors.lName && <span className='text-danger'>{errors.lName.message}</span>}
									<input
										className='form-control'
										{...register('lName', {
											required: ' ( required )',
											minLength: { value: 3, message: ' ( Least 3 characters long )' }
										})}
									/>
								</div>
							</div>
							<div className='form-group mb-4'>
								<label className='mb-2'>E-mail</label>
								{errors.email && <span className='text-danger'>{errors.email.message}</span>}
								<input
									className='form-control'
									{...register('email', {
										required: ' ( required )',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: ' ( Invalid email format )'
										}
									})}
								/>
							</div>
							<div className='row'>
								<div className='form-group col'>
									<label className='mb-2'>Password</label>
									{errors.password && <span className='text-danger'>{errors.password.message}</span>}
									<input
										type='password'
										className='form-control'
										{...register('password', {
											required: ' ( required )',
											minLength: { value: 8, message: ' ( Least 8 characters long )' }
										})}
									/>
								</div>
								<div className='form-group col'>
									<label className='mb-2'>Confirm Password</label>
									{errors.confirmPassword && (
										<span className='text-danger'>{errors.confirmPassword.message}</span>
									)}
									<input
										type='password'
										className='form-control'
										{...register('confirmPassword', {
											required: ' ( required )',
											validate: confirmPasswordMatch
										})}
									/>
								</div>
							</div>
						</div>
						<div className='d-flex justify-content-center'>
							<button type='submit' className='btn btn-secondary'>
								Sign Up
							</button>
						</div>
					</form>
					{/* Not a member */}
					<div className='text-center mt-4'>
						<p className='mb-0'>
							Already registered? <Link to='/signin'>Sign In</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
