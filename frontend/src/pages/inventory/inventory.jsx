import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { getInventoryData, deleteInventoryData } from '../../api/inventoryAPI';

const GetBlood = () => {
	const [bloodData, setBloodData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch blood inventory data
	useEffect(() => {
		const fetchBloodData = async () => {
			try {
				const response = await getInventoryData();
				setBloodData(response.data.data);
			} catch (error) {
				console.error('Error fetching blood data: ', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchBloodData();
	}, []);

	// Function to handle delete button click
	const handleDelete = async (id) => {
		const confirmDelete = await Swal.fire({
			title: 'Are you sure you want to delete?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		});

		if (confirmDelete.isConfirmed) {
			await deleteInventoryData(id);
			setBloodData(bloodData.filter((blood) => blood._id !== id));
			console.log('Deleting blood item with id:', id);
		}
	};

	// Check Expire Status
	const checkExpireStatus = (expiryDate) => {
		try {
			// Convert expiry date string to a Date object
			const expiryDateObject = new Date(expiryDate);

			// Get today's date
			const today = new Date();
			const timeDifference = expiryDateObject.getTime() - today.getTime();
			const daysUntilExpiry = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
			return daysUntilExpiry;
		} catch (error) {
			console.error('Invalid expiry date format. Please use YYYY-MM-DD.');
			return null;
		}
	};

	// Function to handle report generation
	const generateReport = async () => {
		// Display pop-up for date range selection
		const { value: dates } = await Swal.fire({
			title: 'Select Date Range',
			html:
				'<input id="start-date" type="date" class="swal2-input" placeholder="Start Date">' +
				'<input id="end-date" type="date" class="swal2-input" placeholder="End Date">',
			focusConfirm: false,
			preConfirm: () => {
				return [document.getElementById('start-date').value, document.getElementById('end-date').value];
			}
		});

		if (dates && dates[0] && dates[1]) {
			const startDate = new Date(dates[0]);
			const endDate = new Date(dates[1]);
			const filteredBloodData = bloodData.filter((blood) => {
				const bloodDate = new Date(blood.createdAt);
				return bloodDate >= startDate && bloodDate <= endDate;
			});

			if (filteredBloodData.length === 0) {
				Swal.fire({
					icon: 'info',
					title: 'No data available in selected date range'
				});
				return;
			}

			// Calculate total quantities of each blood type
			const bloodTypeTotals = {};
			filteredBloodData.forEach((blood) => {
				const bloodType = `${blood.bloodType}${blood.rhFactor === 'positive' ? '+' : '-'}`;
				if (bloodTypeTotals[bloodType]) {
					bloodTypeTotals[bloodType] += blood.quantity;
				} else {
					bloodTypeTotals[bloodType] = blood.quantity;
				}
			});

			// Generate report with filtered data
			const doc = new jsPDF();

			// Calculate count of datasets
			const datasetCount = filteredBloodData.length;

			// Add header title
			const headerTitle = `Blood Inventory Report (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;
			const headerTitleX = 105; // X coordinate for center alignment
			const headerTitleY = 10; // Y coordinate for vertical alignment
			doc.setFontSize(10);
			doc.text(headerTitle, headerTitleX, headerTitleY, { align: 'center' });

			// Add table
			doc.autoTable({
				head: [
					[
						'Added Date',
						'Modified Date',
						'Blood Type',
						'Quantity (in Pints)',
						'Received Method',
						'Expiry Date',
						'Expiry Status'
					]
				],
				body: filteredBloodData.map((blood) => [
					new Date(blood.createdAt).toLocaleDateString(),
					new Date(blood.updatedAt).toLocaleDateString(),
					`${blood.bloodType}${blood.rhFactor === 'positive' ? '+' : '-'}`,
					blood.quantity,
					blood.receivedMethod === 'donation' ? 'Donation' : 'Purchase',
					new Date(blood.expiryDate).toLocaleDateString(),
					checkExpireStatus(blood.expiryDate) < 0
						? 'Expired'
						: checkExpireStatus(blood.expiryDate) < 3
						? 'Short Expiry'
						: 'Healthy'
				])
			});

			// Add total quantities of each blood type below the table
			let currentY = doc.autoTable.previous.finalY + 10;
			Object.entries(bloodTypeTotals).forEach(([type, quantity]) => {
				const text = `Total ${type} ( ${quantity} Pints )`;
				doc.text(text, 14, currentY);
				currentY += 7;
			});

			doc.text(`Dataset Count: ${datasetCount}`, 14, currentY);

			doc.save('blood_inventory_report.pdf');
		}
	};

	return (
		<div className='container'>
			<h1 className='mt-5 mb-4'>Blood Inventory</h1>
			<Link className='btn btn-danger mb-3 border' to='/inventory/add'>
				Add to Inventory
			</Link>
			<button onClick={generateReport} className='btn btn-primary mb-3 ms-3 border'>
				Download Report
			</button>
			{isLoading ? (
				<h3>Loading Data...</h3>
			) : (
				<table className='table table-striped table-hover table-bordered mb-5'>
					<thead className='text-center align-middle table-dark'>
						<tr>
							<th scope='col'>Added Date</th>
							<th scope='col'>Modified Date</th>
							<th scope='col'>Blood Type</th>
							<th scope='col'>Quantity (in Pints)</th>
							<th scope='col'>Received Method</th>
							<th scope='col'>Expiry Date</th>
							<th scope='col'>Expiry Status</th>
							<th scope='col'>Actions</th>
						</tr>
					</thead>
					<tbody className='text-center align-middle'>
						{bloodData.map((blood, index) => (
							<tr key={index}>
								<td>{new Date(blood.createdAt).toISOString().split('T')[0]}</td>
								<td>{new Date(blood.updatedAt).toISOString().split('T')[0]}</td>
								<td>
									{blood.bloodType}
									{blood.rhFactor === 'positive' ? '+' : '-'}
								</td>
								<td>{blood.quantity}</td>
								<td>{blood.receivedMethod === 'donation' ? 'Donation' : 'Purchase'}</td>
								<td>{new Date(blood.expiryDate).toISOString().split('T')[0]}</td>
								<td>
									{checkExpireStatus(blood.expiryDate) < 0 ? (
										<span className='badge text-light bg-danger border-info'>Expired</span>
									) : checkExpireStatus(blood.expiryDate) < 3 ? (
										<span className='badge text-light bg-warning border-info'>Short Expiry</span>
									) : (
										<span className='badge text-light bg-success border-info'>Healthy</span>
									)}
								</td>
								<td>
									<Link to={`/${blood._id}/update`} className='btn btn-body me-2 border border-dark'>
										Update
									</Link>
									<button
										onClick={() => handleDelete(blood._id)}
										className='btn btn-danger border border-dark'
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default GetBlood;
