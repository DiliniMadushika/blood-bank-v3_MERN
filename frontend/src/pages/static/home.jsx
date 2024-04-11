import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const isLoggedIn = useAuth();
	const navigate = useNavigate();

	return (
		<div className='height-100-minus-60'>
			<div className='container py-5'>
				<div className='jumbotron'>
					<h1 className='display-4'>Welcome to our Blood Reservation System</h1>
					<p className='lead'>
						We are dedicated to connecting donors with those in need. Your contribution can save lives.
					</p>

					<button
						className='btn btn-danger'
						onClick={() => {
							if (!isLoggedIn) navigate('/signin');
							else navigate('/request');
						}}
					>
						Request Blood
					</button>
				</div>
				<div className='my-5'></div>
				<h2>Why Donate Blood?</h2>
				<p>
					Blood is the most precious gift that anyone can give to another person — the gift of life. A decision to
					donate your blood can save a life, or even several if your blood is separated into its components — red
					cells, platelets and plasma.
				</p>

				<h2>How to Request Blood?</h2>
				<p>
					If you or your loved one is in need, you can request blood from our system. We connect you with willing
					donors who match your blood type.
				</p>

				<h2>Join Our Community</h2>
				<p>Join our community of donors and recipients. Together, we can make a difference and save lives.</p>
			</div>
		</div>
	);
};

export default Home;
