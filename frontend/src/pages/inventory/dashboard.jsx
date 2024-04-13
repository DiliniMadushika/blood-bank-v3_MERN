import { getExpireData, getBloodTotalData } from '../../api/inventoryAPI'; // Import the getExpireData function from the appropriate module
import { useEffect, useState } from 'react'; // Import the useEffect hook from the react package
const InventoryDashboard = () => {
	const [expired, setExpired] = useState(null);
	const [shortExpiry, setShortExpiry] = useState(null);
	const [goodBlood, setGoodBlood] = useState(null);
	const [aPositiveTotal, setAPositiveTotal] = useState(null);
	const [bPositiveTotal, setBPositiveTotal] = useState(null);
	const [abPositiveTotal, setABPositiveTotal] = useState(null);
	const [oPositiveTotal, setOPositiveTotal] = useState(null);
	const [aNegativeTotal, setANegativeTotal] = useState(null);
	const [bNegativeTotal, setBNegativeTotal] = useState(null);
	const [abNegativeTotal, setABNegativeTotal] = useState(null);
	const [oNegativeTotal, setONegativeTotal] = useState(null);

	// Sync Data button handler
	const handleSyncData = () => {
		window.location.reload();
	};

	useEffect(() => {
		const fetchInventoryData = async () => {
			try {
				const response = await getExpireData(); // Use the imported getExpireData function
				setExpired(response.data.expired);
				setShortExpiry(response.data.short);
				setGoodBlood(response.data.good);
			} catch (error) {
				console.error('Error fetching inventory data: ', error);
			}
		};
		fetchInventoryData();
	}, []);

	useEffect(() => {
		const fetchBloodTotalData = async () => {
			try {
				const response = await getBloodTotalData();
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
		fetchBloodTotalData();
	}, []);

	console.log(expired);

	return (
		<div className='container height-100-minus-172'>
			<h1 className='mt-5 mb-4'>Inventory Dashboard</h1>

			<div className='row'>
				<div className='col'>
					<div className='row gap-4 m-0'>
						{/* Show Total Blood Card */}
						<div className='card text-white bg-primary mb-3 col'>
							<div className='card-header'>Total Blood</div>
							<div className='card-body'>
								<h5 className='card-title'>Total Blood</h5>
								<p className='card-text'>{expired + shortExpiry + goodBlood} Pints</p>
							</div>
						</div>

						{/* Show Expired Card */}
						<div className='card text-white bg-danger mb-3 col'>
							<div className='card-header'>Expired Blood</div>
							<div className='card-body'>
								<h5 className='card-title'>Expired Blood</h5>
								<p className='card-text'>{expired} Pints</p>
							</div>
						</div>
					</div>

					<div className='row gap-4 m-0'>
						{/* Show Short Expiry Card */}
						<div className='card text-white bg-warning mb-3 col'>
							<div className='card-header'>Short Expiry Blood</div>
							<div className='card-body'>
								<h5 className='card-title'>Short Expiry Blood</h5>
								<p className='card-text'>{shortExpiry} Pints</p>
							</div>
						</div>
						{/* Show Healthy Blood Card */}
						<div className='card text-white bg-success mb-3 col'>
							<div className='card-header'>Healthy Blood</div>
							<div className='card-body'>
								<h5 className='card-title'>Healthy Blood</h5>
								<p className='card-text'>{goodBlood} Pints</p>
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

export default InventoryDashboard;
