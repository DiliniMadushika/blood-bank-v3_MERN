import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth, useRole } from '../../hooks/useAuth';

import Logo from '../../assets/logo.webp';

const Header = () => {
	const isLoggedIn = useAuth();
	const role = useRole();

	// Define navbar for different roles
	const navbar = () => {
		if (role === 'inventoryManager') {
			return [
				{ name: 'Dashboard', route: '/' },
				{ name: 'Inventory', route: '/inventory' }
			];
		} else if (role === 'requestManager') {
			return [
				{ name: 'Dashboard', route: '/' },
				{ name: 'Requests', route: '/requests' }
			];
		} else {
			return [];
		}
	};

	const welcomeMessage = () => {
		if (isLoggedIn) {
			if (role === 'user') {
				return 'Welcome, User';
			} else if (role === 'inventoryManager') {
				return 'Welcome, Inventory Manager';
			} else if (role === 'requestManager') {
				return 'Welcome, Request Manager';
			}
		} else {
			return 'Welcome to Blood Bank';
		}
	};

	const navItems = navbar();

	// Sign out function
	const signOut = async () => {
		const confirmLogout = await Swal.fire({
			title: 'Are you sure you want to sign out?',
			text: "You'll be logged out of the system.",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Sign Out'
		});

		if (confirmLogout.isConfirmed) {
			localStorage.clear();
			window.location.href = '/';
		}
	};
	return (
		<div className='sticky-top position-fixed bg-light w-100 h-auto'>
			<nav className='navbar navbar-light'>
				<div className='navbar-brand p-1 text-dark mx-2 '>
					<Link to='/'>
						<img src={Logo} alt='logo' width='50' height='50' className='me-3 rounded' />
					</Link>
					{welcomeMessage()}
				</div>
				<div className='row justify-content-between align-items-center'>
					<div className='col'>
						<ul className='nav  justify-content-center'>
							{navItems.map((item) => (
								<li
									key={item.name}
									className='nav-item badge text-bg-body border border-black rounded-pill mx-2 p-0'
								>
									<Link to={item.route} className='nav-link active text-dark'>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className='nav justify-content-end mx-2 '>
					{/* Sign In And Sign Out */}
					{isLoggedIn ? (
						<button className='btn btn-light m-1 border-dark' onClick={signOut}>
							Sign Out
						</button>
					) : (
						<Link className='btn btn-danger m-1 border-dark' to='/signin'>
							Sign In
						</Link>
					)}
				</div>
			</nav>
		</div>
	);
};

export default Header;
