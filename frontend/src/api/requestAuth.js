const requestAuth = {
	headers: {
		'Authorization': `Bearer ${localStorage.getItem('token')}` || '',
		'Content-type': 'application/json'
	}
};

export default requestAuth;
