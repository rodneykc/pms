// sss/src/components/SurgeryScheduling.js
import React, { useState, useEffect } from 'react';

function SurgeryScheduling() {
  const [surgeryRequests, setSurgeryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurgeryRequests = async () => {
      try {
        const response = await fetch('/api/surgery-requests/pending');
        const data = await response.json();
        
        if (data.success) {
          setSurgeryRequests(data.data);
        } else {
          setError(data.error || 'Failed to fetch surgery requests');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching surgery requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeryRequests();
  }, []);

  if (loading) {
    return <div>Loading surgery requests...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="surgery-scheduling">
      <h2>Pending Surgery Requests</h2>
      <div className="table-container">
        <table className="surgery-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Procedure</th>
              <th>Surgeon</th>
              <th>Requested Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Cleared</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {surgeryRequests.length > 0 ? (
              surgeryRequests.map((request) => (
                <tr key={request.SURGReqID}>
                  <td>{request.patientName}</td>
                  <td>{request.procedureDescription}</td>
                  <td>{request.surgeon}</td>
                  <td>{request.requestedDate}</td>
                  <td>{request.location}</td>
                  <td>{request.status}</td>
                  <td>{request.clearedToSchedule}</td>
                  <td>
                    <button className="action-btn">View</button>
                    <button className="action-btn">Schedule</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No pending surgery requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .surgery-scheduling {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .table-container {
          width: 100%;
          overflow-x: auto;
        }
        
        .surgery-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          font-size: 14px;
        }
        
        .surgery-table th,
        .surgery-table td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        
        .surgery-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        
        .surgery-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        .surgery-table tr:hover {
          background-color: #f1f1f1;
        }
        
        .action-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 5px 10px;
          margin: 2px;
          border-radius: 3px;
          cursor: pointer;
        }
        
        .action-btn:hover {
          background-color: #45a049;
        }
        
        .error {
          color: red;
          padding: 10px;
          background-color: #ffebee;
          border-radius: 4px;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}

export default SurgeryScheduling;
