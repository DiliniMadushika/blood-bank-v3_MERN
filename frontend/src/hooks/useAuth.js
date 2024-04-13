import { useState, useEffect } from 'react';

export function useAuth() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		setIsLoggedIn(!!token); // Check if token exists
	}, []);

	return isLoggedIn;
}

export function useRole() {
	const [role, setRole] = useState('');

	useEffect(() => {
		const role = localStorage.getItem('role');
		setRole(role);
	}, []);

	return role;
}
