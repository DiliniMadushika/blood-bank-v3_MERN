import { getBloodTotalDataR } from '../../api/inventoryAPI';
import { getRequestCountData } from '../../api/requestAPI';
import { useEffect, useState } from 'react';

const RequestDashboard = () => {
	const [rejected, setRejected] = useState(0);
	const [pending, setPending] = useState(0);
	const [approved, setApproved] = useState(0);
	const [total, setTotal] = useState(0);
	const [aPositiveTotal, setAPositiveTotal] = useState(0);
	const [bPositiveTotal, setBPositiveTotal] = useState(0);
	const [abPositiveTotal, setABPositiveTotal] = useState(0);
	const [oPositiveTotal, setOPositiveTotal] = useState(0);
	const [aNegativeTotal, setANegativeTotal] = useState(0);
	const [bNegativeTotal, setBNegativeTotal] = useState(0);
	const [abNegativeTotal, setABNegativeTotal] = useState(0);
	const [oNegativeTotal, setONegativeTotal] = useState(0);

	// Sync Data button handler
	const handleSyncData = () => {
		window.location.reload();
	};

	// Fetch the data from the API
	useEffect(() => {
		const fetchInventoryData = async () => {
			try {
				const response = await getRequestCountData(); // Use the imported getExpireData function
				setPending(response.data.pending);
				setApproved(response.data.approved);
				setRejected(response.data.rejected);
				setTotal(response.data.total);
			} catch (error) {
				console.error('Error fetching request data: ', error);
			}
		};
		fetchInventoryData();
	}, []);

	useEffect(() => {
		const fetchBloodTotalDataR = async () => {
			try {
				const response = await getBloodTotalDataR();
				setAPositiveTotal(response.data.aPositiveTotal);
				setBPositiveTotal(response.data.bPositiveTotal);
				setABPositiveTotal(response.data.abPositiveTotal);
				setOPositiveTotal(response.data.oPositiveTotal);
				setANegativeTotal(response.data.aNegativeTotal);
				setBNegativeTotal(response.data.bNegativeTotal);
				setABNegativeTotal(response.data.abNegativeTotal);
				setONegativeTotal(response.data.oNegativeTotal);
			} catch (error) {
				console.error('Error fetching blood total data: ', error);
			}
		};
		fetchBloodTotalDataR();
	}, []);

	// console.log(expired);

	return (
		<div className='container height-100-minus-172'>
			<h1 className='mt-5 mb-4'>Request Dashboard</h1>

			<div className='row'>
				<div className='col'>
					<div className='row gap-4 m-0'>
						{/* Show Total Request Card */}
						<div className='card text-white bg-primary mb-3 col'>
							<div className='card-header'>Total Requests</div>
							<div className='card-body'>
								<h5 className='card-title'>Total Requests</h5>
								<p className='card-text'>{total}</p>
							</div>
						</div>

						{/* Show Expired Card */}
						<div className='card text-white bg-danger mb-3 col'>
							<div className='card-header'>Rejected Requests</div>
							<div className='card-body'>
								<h5 className='card-title'>Rejected Requests</h5>
								<p className='card-text'>{rejected}</p>
							</div>
						</div>
					</div>

					<div className='row gap-4 m-0'>
						{/* Show Short Expiry Card */}
						<div className='card text-white bg-warning mb-3 col'>
							<div className='card-header'>Pending Requests</div>
							<div className='card-body'>
								<h5 className='card-title'>Pending Requests</h5>
								<p className='card-text'>{pending}</p>
							</div>
						</div>
						{/* Show Healthy Blood Card */}
						<div className='card text-white bg-success mb-3 col'>
							<div className='card-header'>Approved Requests</div>
							<div className='card-body'>
								<h5 className='card-title'>Approved Requests</h5>
								<p className='card-text'>{approved}</p>
							</div>
						</div>
					</div>
				</div>
				<div className='col row gap-4 w-100 m-0'>
					{/* blood type total */}
					<div className='card bg-body-tertiary mb-3 col text-center'>
						<div className='card-header'>Positive (+)</div>
						<div className='card-body'>
							<h5 className='card-title'>Total</h5>
							<p className='card-text'>A+ : {aPositiveTotal} Pints</p>
							<p className='card-text'>B+ : {bPositiveTotal} Pints</p>
							<p className='card-text'>AB+ : {abPositiveTotal} Pints</p>
							<p className='card-text'>O+ : {oPositiveTotal} Pints</p>
						</div>
					</div>
					{/* blood type total */}
					<div className='card bg-body-tertiary mb-3 col text-center'>
						<div className='card-header'>Negative (-)</div>
						<div className='card-body'>
							<h5 className='card-title'>Total</h5>
							<p className='card-text'>A- : {aNegativeTotal} Pints</p>
							<p className='card-text'>B- : {bNegativeTotal} Pints</p>
							<p className='card-text'>AB- : {abNegativeTotal} Pints</p>
							<p className='card-text'>O- : {oNegativeTotal} Pints</p>
						</div>
					</div>
				</div>
			</div>
			{/* Data Fetching time */}
			<div className='card text-dark bg-body-tertiary w-100 text-center h6'>
				<div className='card-header'>Last Syncing Info</div>
				<div className='card-body'>
					<h5 className='card-title'>Data Fetching Time</h5>
					<p className='card-text text-danger'>Data Fetching Time {new Date().toLocaleString()}</p>
					<button className='btn btn-primary' onClick={handleSyncData}>
						Sync Data
					</button>
				</div>
			</div>
		</div>
	);
};

export default RequestDashboard;
