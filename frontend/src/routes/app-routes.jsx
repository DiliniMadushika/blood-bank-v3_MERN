import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import * as Pages from '../pages';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';

// Inventory Manager Routes
const iManagerRoutes = [
	{
		path: '/',
		element: <Pages.InventoryDashboard />
	},
	{
		path: '/inventory',
		element: <Pages.GetBlood />
	},
	{
		path: '/inventory/add',
		element: <Pages.AddBlood />
	},
	{
		path: '/:id/update',
		element: <Pages.UpdateBlood />
	}
];

// Request Manager Routes
const rManagerRoutes = [
	{
		path: '/',
		element: <Pages.RequestDashboard />
	},
	{
		path: '/requests',
		element: <Pages.GetRequests />
	},
	{
		path: '/:id/update',
		element: <Pages.UpdateRequest />
	}
];

// User Routes
const userRoutes = [
	{
		path: '/',
		element: <Pages.Home />
	},
	{
		path: '/request',
		element: <Pages.NewRequest />
	}
];

// Routes for the application
const guestRoutes = [
	{
		path: '/',
		element: <Pages.Home />
	},
	{
		path: '/signin',
		element: <Pages.SignIn />
	},
	{
		path: '/signup',
		element: <Pages.SignUp />
	}
];

// AppRoutes component
const AppRoutes = () => {
	// Check if user is logged in
	const isLoggedIn = localStorage.getItem('token');
	const role = localStorage.getItem('role');

	// Define routes based on role
	const getRoutes = () => {
		if (!isLoggedIn) {
			return guestRoutes; // Guest routes when not logged in
		} else if (role === 'inventoryManager') {
			return iManagerRoutes; // Inventory manager routes
		} else if (role === 'requestManager') {
			return rManagerRoutes; // Request manager routes
		} else if (role === 'user') {
			return userRoutes; // User routes
		}
	};

	const useRoutes = getRoutes();

	return (
		<div>
			<Router>
				<Header />
				<Routes>
					{useRoutes.map((route, index) => (
						<Route key={index} path={route.path} element={route.element} />
					))}
				</Routes>
				<Footer />
			</Router>
		</div>
	);
};

export default AppRoutes;
