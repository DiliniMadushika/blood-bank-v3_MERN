import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { loginUser } from '../../api/userAPI';

export default function SignIn() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm();

	const onSubmit = async (values) => {
		try {
			const response = await loginUser(values);
			if (response.status === 200) {
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('role', response.data.user.userRole);
				Swal.fire({
					icon: 'success',
					title: 'Login Successful',
					text: 'You have successfully logged in',
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
				title: 'Login Failed',
				text: error.message || 'Invalid Credentials!',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true
			});
		}
	};

	return (
		<div className='d-flex justify-content-center align-items-center bg-body height-100-minus-60'>
			<div className='card text-dark bg-body mb-3 w-25'>
				<div className='card-header text-center'>Sign In</div>
				<div className='card-body'>
					<form className='needs-validation' onSubmit={handleSubmit(onSubmit)}>
						<div className='mt-4 mb-5'>
							<div className='form-group mb-4'>
								<label className='mb-2'>E-mail</label>
								{errors.email && <span className='text-danger'>{errors.email.message}</span>}
								<input
									className='form-control'
									{...register('email', {
										required: ' ( Email is required )',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: ' ( Invalid email format )'
										}
									})}
								/>
							</div>
							<div className='form-group mb-2'>
								<label className='mb-2'>Password</label>
								{errors.password && <span className='text-danger'> ( Password is required )</span>}
								<input type='password' className='form-control' {...register('password', { required: true })} />
							</div>
						</div>
						<div className='d-flex justify-content-center'>
							<button type='submit' className='btn btn-secondary'>
								Sign In
							</button>
						</div>
					</form>
					{/* Not a member */}
					<div className='text-center mt-4'>
						<p className='mb-0'>
							Not a member? <Link to='/signup'>Register</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
