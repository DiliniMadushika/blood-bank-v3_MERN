import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { getRequestData, deleteRequestData, getRequestDataById } from '../../api/requestAPI';
import logo from '../../assets/logo.webp';

const GetRequests = () => {
	const [requestData, setRequestData] = useState([]);

	// Fetch request data
	useEffect(() => {
		const fetchRequestData = async () => {
			try {
				const response = await getRequestData();
				setRequestData(response.data);
			} catch (error) {
				console.error('Error fetching request data: ', error);
			}
		};
		fetchRequestData();
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
			await deleteRequestData(id);
			setRequestData(requestData.filter((request) => request._id !== id));
			console.log('Deleting request item with id:', id);
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
			const filteredRequestData = requestData.filter((request) => {
				const requestDate = new Date(request.createdAt);
				return requestDate >= startDate && requestDate <= endDate;
			});

			if (filteredRequestData.length === 0) {
				Swal.fire({
					icon: 'info',
					title: 'No data available in selected date range'
				});
				return;
			}

			// Generate report with filtered data
			const doc = new jsPDF();

			// Calculate count of datasets
			const datasetCount = filteredRequestData.length;

			// Add header title
			const headerTitle = `Blood Request Report (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;
			const headerTitleX = 105; // X coordinate for center alignment
			const headerTitleY = 10; // Y coordinate for vertical alignment
			doc.setFontSize(10);
			doc.text(headerTitle, headerTitleX, headerTitleY, { align: 'center' });

			// Add table
			doc.autoTable({
				head: [['Date', 'Hospital Name', 'Blood Type', 'Qty (in Pints)', 'Physician Name', 'Priority']],
				body: filteredRequestData.map((request) => [
					new Date(request.createdAt).toLocaleDateString(),
					request.requestHospitalName,
					`${request.bloodType}${request.rhFactor === 'positive' ? '+' : '-'}`,
					request.numberOfUnits,
					request.physicianName,
					request.priority
				])
			});

			// Calculate total quantities of each blood type
			const bloodTypeTotals = {};
			filteredRequestData.forEach((request) => {
				const bloodType = `${request.bloodType}${request.rhFactor === 'positive' ? '+' : '-'}`;
				if (bloodTypeTotals[bloodType]) {
					bloodTypeTotals[bloodType] += request.numberOfUnits;
				} else {
					bloodTypeTotals[bloodType] = request.numberOfUnits;
				}
			});

			// Add total quantities of each blood type below the table
			let currentY = doc.autoTable.previous.finalY + 10;
			Object.entries(bloodTypeTotals).forEach(([type, quantity]) => {
				const text = `Total ${type} (${quantity} Pints)`;
				doc.text(text, 14, currentY);
				currentY += 7;
			});

			// Add dataset count
			doc.text(`Request Count: ${datasetCount}`, 14, currentY);

			doc.save('request_report.pdf');
		}
	};

	/// Function to handle invoice button click
	const handleInvoice = async (id) => {
		try {
			// Get request data by id
			const request = await getRequestDataById(id);
			console.log('Request data:', request);

			// Generate invoice content
			const doc = new jsPDF();

			// Add logo to the top left corner
			const logoWidth = 30;
			const logoHeight = 30;
			const marginLeft = 10;
			const marginTop = 10;
			doc.addImage(logo, 'JPEG', marginLeft, marginTop, logoWidth, logoHeight);

			// Add generated date time to top right
			const generatedDate = new Date().toLocaleString();
			const pageWidth = doc.internal.pageSize.width;
			const marginRight = 10; // Adjust the right margin as needed
			doc.text(generatedDate, pageWidth - marginRight, marginTop, { align: 'right' });

			// Add title
			doc.setFont('helvetica', 'bold');
			doc.setFontSize(20);
			doc.text('Invoice', 105, 40, { align: 'center' });

			// Add content to the PDF
			doc.setFont('helvetica', 'normal');
			doc.setFontSize(12);
			doc.text(`Request Date: ${new Date(request.data.request.createdAt).toLocaleDateString()}`, 10, 60);
			doc.text(`Hospital Name: ${request.data.request.requestHospitalName}`, 10, 70);
			doc.text(
				`Blood Type: ${request.data.request.bloodType}${request.rhFactor === 'positive' ? '+' : '-'}`,
				10,
				80
			);
			doc.text(`Quantity: ${request.data.request.numberOfUnits} Pints`, 10, 90);
			doc.text(`Physician Name: ${request.data.request.physicianName}`, 10, 100);
			doc.text(`Physician Phone: ${request.data.request.physicianPhone}`, 10, 110);
			doc.text(
				`Category: ${
					request.data.request.category === 'bulk'
						? 'Bulk'
						: request.data.request.category === 'single'
						? 'Single'
						: '-'
				}`,
				10,
				120
			);
			doc.text(`Note: ${request.data.request.note}`, 10, 130);
			doc.setFont('helvetica', 'italic');
			doc.text('Thank you!', 105, 140, { align: 'center' });

			// Save the PDF
			doc.save('invoice.pdf');
		} catch (error) {
			console.error('Error generating invoice:', error);
		}
	};

	return (
		<div className='container'>
			{requestData.length === 0 ? (
				<div>
					<h1 className='mt-5 mb-4'>Request List</h1>
					<p>No Requests Available</p>
				</div>
			) : (
				<div>
					<h1 className='mt-5 mb-4'>Request List</h1>
					<button className='btn btn-primary mb-3 border' onClick={generateReport}>
						Download Report
					</button>
					<table className='table table-striped table-hover table-bordered mb-5'>
						<thead className='text-center align-middle table-dark'>
							<tr>
								<th scope='col'>Date</th>
								<th scope='col'>Hospital Name</th>
								<th scope='col'>Blood Type</th>
								<th scope='col'>Qty (in Pints)</th>
								<th scope='col'>Physician Name</th>
								<th scope='col'>Physician Phone</th>
								<th scope='col'>Priority</th>
								<th scope='col'>Category</th>
								<th scope='col'>Status</th>
								{/* <th scope='col'>Note</th> */}
								<th scope='col'>Actions</th>
							</tr>
						</thead>
						<tbody className='text-center align-middle'>
							{requestData.map((request, index) => (
								<tr key={index}>
									<td>{new Date(request.createdAt).toISOString().split('T')[0]}</td>
									<td>{request.requestHospitalName}</td>
									<td>
										{request.bloodType}
										{request.rhFactor === 'positive' ? '+' : '-'}
									</td>
									<td>{request.numberOfUnits}</td>
									<td>{request.physicianName}</td>
									<td>{request.physicianPhone}</td>
									<td>{request.priority}</td>
									<td>
										{request.category === 'bulk' ? 'Bulk' : request.category === 'single' ? 'Single' : '-'}
									</td>
									<td>
										<span
											className={`badge ${
												request.status === 'pending'
													? 'bg-warning'
													: request.status === 'approved'
													? 'bg-success'
													: 'bg-danger'
											}`}
										>
											{request.status === 'pending'
												? 'Pending'
												: request.status === 'approved'
												? 'Approved'
												: 'Rejected'}
										</span>
									</td>
									{/* <td>{request.note}</td> */}
									<td>
										<button
											onClick={() => handleInvoice(request._id)}
											className='btn btn-primary border border-dark me-2'
										>
											Invoice
										</button>
										<Link to={`/${request._id}/update`} className='btn btn-body border border-dark me-2'>
											Update
										</Link>
										<button
											onClick={() => handleDelete(request._id)}
											className='btn btn-danger border border-dark'
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default GetRequests;
