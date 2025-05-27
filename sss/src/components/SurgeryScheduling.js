// sss/src/components/SurgeryScheduling.js
import React, { useState, useEffect, useMemo } from 'react';

function SurgeryScheduling() {
  const [surgeryRequests, setSurgeryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [practiceFilter, setPracticeFilter] = useState('All');
  const [surgeonFilter, setSurgeonFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [showPracticeFilter, setShowPracticeFilter] = useState(false);
  const [showSurgeonFilter, setShowSurgeonFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const rowsPerPage = 15;

  useEffect(() => {
    const fetchSurgeryRequests = async () => {
      try {
        console.log('Fetching surgery requests...');
        const response = await fetch('/api/surgery-requests/pending');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
          const sortedRequests = [...data.data].sort((a, b) => 
            b.SURGReqID - a.SURGReqID
          );
          setSurgeryRequests(sortedRequests);
        } else {
          setError('Failed to load surgery requests');
        }
      } catch (err) {
        const errorMsg = 'Error connecting to the server: ' + err.message;
        console.error(errorMsg, err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchSurgeryRequests();
  }, []);

  // Get unique values for filters
  const practiceOptions = useMemo(() => {
    const practices = [...new Set(surgeryRequests.map(r => r.practicename).filter(Boolean))];
    return ['All', ...practices];
  }, [surgeryRequests]);

  const surgeonOptions = useMemo(() => {
    const surgeons = [...new Set(surgeryRequests.map(r => r.surgeon).filter(Boolean))];
    return ['All', ...surgeons];
  }, [surgeryRequests]);

  const locationOptions = useMemo(() => {
    const locations = [...new Set(surgeryRequests.map(r => r.location).filter(Boolean))];
    return ['All', ...locations];
  }, [surgeryRequests]);

  // Toggle filter visibility
  const toggleFilter = (filterType) => (e) => {
    e.stopPropagation();
    switch(filterType) {
      case 'practice':
        setShowPracticeFilter(!showPracticeFilter);
        setShowSurgeonFilter(false);
        setShowLocationFilter(false);
        break;
      case 'surgeon':
        setShowSurgeonFilter(!showSurgeonFilter);
        setShowPracticeFilter(false);
        setShowLocationFilter(false);
        break;
      case 'location':
        setShowLocationFilter(!showLocationFilter);
        setShowPracticeFilter(false);
        setShowSurgeonFilter(false);
        break;
      default:
        break;
    }
  };

  // Close all filters when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPracticeFilter(false);
      setShowSurgeonFilter(false);
      setShowLocationFilter(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter the requests based on all active filters
  const filteredRequests = useMemo(() => {
    return surgeryRequests.filter(request => {
      const matchesPractice = practiceFilter === 'All' || request.practicename === practiceFilter;
      const matchesSurgeon = surgeonFilter === 'All' || request.surgeon === surgeonFilter;
      const matchesLocation = locationFilter === 'All' || request.location === locationFilter;
      return matchesPractice && matchesSurgeon && matchesLocation;
    });
  }, [surgeryRequests, practiceFilter, surgeonFilter, locationFilter]);

  // Get current rows for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRequests.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [practiceFilter, surgeonFilter, locationFilter]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) {
    return <div className="loading">Loading surgery requests...</div>;
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
              <th>Request ID</th>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Patient Status</th>
              <th>
                <div className="filter-header">
                  <div className="filter-label" onClick={toggleFilter('practice')}>
                    Practice
                    <span className="filter-arrow">▼</span>
                  </div>
                  {showPracticeFilter && (
                    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="filter-options">
                        {practiceOptions.map((practice, index) => (
                          <div
                            key={index}
                            className={`filter-option ${practiceFilter === practice ? 'selected' : ''}`}
                            onClick={() => {
                              setPracticeFilter(practice);
                              setShowPracticeFilter(false);
                            }}
                          >
                            {practice || 'All Practices'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </th>
              <th>
                <div className="filter-header">
                  <div className="filter-label" onClick={toggleFilter('surgeon')}>
                    Surgeon
                    <span className="filter-arrow">▼</span>
                  </div>
                  {showSurgeonFilter && (
                    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="filter-options">
                        {surgeonOptions.map((surgeon, index) => (
                          <div
                            key={index}
                            className={`filter-option ${surgeonFilter === surgeon ? 'selected' : ''}`}
                            onClick={() => {
                              setSurgeonFilter(surgeon);
                              setShowSurgeonFilter(false);
                            }}
                          >
                            {surgeon || 'All Surgeons'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </th>
              <th>
                <div className="filter-header">
                  <div className="filter-label" onClick={toggleFilter('location')}>
                    Location
                    <span className="filter-arrow">▼</span>
                  </div>
                  {showLocationFilter && (
                    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="filter-options">
                        {locationOptions.map((location, index) => (
                          <div
                            key={index}
                            className={`filter-option ${locationFilter === location ? 'selected' : ''}`}
                            onClick={() => {
                              setLocationFilter(location);
                              setShowLocationFilter(false);
                            }}
                          >
                            {location || 'All Locations'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </th>
              <th>Procedure</th>
              <th>Requested Date</th>
              <th>Location Type</th>
              <th>Anesthesia</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Cleared</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((request) => (
                <tr key={request.SURGReqID}>
                  <td>{request.SURGReqID}</td>
                  <td>{request.pid}</td>
                  <td>{request.patientName}</td>
                  <td>{request.patientStatus || 'N/A'}</td>
                  <td>{request.practicename || 'N/A'}</td>
                  <td>{request.surgeon || 'N/A'}</td>
                  <td>{request.location || 'N/A'}</td>
                  <td>{request.procedureDescription}</td>
                  <td>{request.requestedDate || 'N/A'}</td>
                  <td>{request.locationType || 'N/A'}</td>
                  <td>{request.anesthesiaType || 'N/A'}</td>
                  <td>{request.payMethod || 'N/A'}</td>
                  <td>{request.status || 'N/A'}</td>
                  <td>{request.clearedToSchedule || 'No'}</td>
                  <td>
                    <button className="action-btn">View</button>
                    <button className="action-btn">Schedule</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15">No matching surgery requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination and record count */}
      <div className="pagination-container">
        <div className="filter-count">
          {practiceFilter !== 'All' && (
            <span className="active-filter">
              Practice: {practiceFilter}
              <button 
                onClick={() => setPracticeFilter('All')}
                className="clear-filter"
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
          {surgeonFilter !== 'All' && (
            <span className="active-filter">
              Surgeon: {surgeonFilter}
              <button 
                onClick={() => setSurgeonFilter('All')}
                className="clear-filter"
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
          {locationFilter !== 'All' && (
            <span className="active-filter">
              Location: {locationFilter}
              <button 
                onClick={() => setLocationFilter('All')}
                className="clear-filter"
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
          <span>Showing {filteredRequests.length} of {surgeryRequests.length} records</span>
        </div>
        {filteredRequests.length > rowsPerPage && (
          <div className="pagination">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                if (i === 3 && currentPage < totalPages - 3) {
                  return <span key="ellipsis" className="ellipsis">...</span>;
                }
                if (i === 4 && currentPage < totalPages - 3) {
                  return (
                    <React.Fragment key="last">
                      <button 
                        onClick={() => paginate(totalPages)}
                        className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                      >
                        {totalPages}
                      </button>
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
      
      <style>{`
        .surgery-scheduling {
          padding: 10px;
          font-family: Arial, sans-serif;
        }
        
        h2 {
          color: #ffffff; /* Changed from default color to white */
          margin-bottom: 15px;
        }
        
        .table-container {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .surgery-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        
        .surgery-table th,
        .surgery-table td {
          padding: 8px 10px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
          white-space: nowrap;
        }
        
        .surgery-table th {
          background-color: #f5f5f5;
          font-weight: 600;
          color: #333;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .surgery-table tbody tr:hover {
          background-color:rgb(40, 74, 129) !important;
        }
        
        .loading, .error {
          padding: 10px;
          margin: 5px 0;
          border-radius: 4px;
          text-align: center;
          color: #333;
        }
        
        .loading {
          background-color: #e3f2fd;
          color: #0d47a1;
        }
        
        .error {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .action-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 2px 6px;
          margin: 1px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 0.7rem;
          line-height: 1.2;
        }
        
        .action-btn:hover {
          background-color: #45a049;
        }
        
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .filter-count {
          font-size: 0.9rem;
          color: #555;
          padding: 5px 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        
        .filter-header {
          position: relative;
          display: inline-block;
        }
        
        .filter-label {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 4px;
          border-radius: 3px;
          user-select: none;
        }
        
        .filter-label:hover {
          background-color: #f0f0f0;
        }
        
        .filter-arrow {
          font-size: 0.7em;
          opacity: 0.7;
          transition: transform 0.2s;
        }
        
        .filter-label:hover .filter-arrow {
          opacity: 1;
        }
        
        .filter-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 180px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .filter-options {
          padding: 4px 0;
        }
        
        .filter-option {
          padding: 6px 12px;
          cursor: pointer;
          white-space: nowrap;
        }
        
        .filter-option:hover {
          background-color: #f5f5f5;
        }
        
        .filter-option.selected {
          background-color: #e3f2fd;
          color: #1976d2;
          font-weight: 500;
        }
        
        .active-filter {
          display: inline-flex;
          align-items: center;
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 8px;
          border-radius: 12px;
          margin-right: 10px;
          font-size: 0.85rem;
        }
        
        .clear-filter {
          background: none;
          border: none;
          color: #1976d2;
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
          margin-left: 6px;
          padding: 0 4px 2px;
          border-radius: 50%;
        }
        
        .clear-filter:hover {
          background-color: #bbdefb;
        }
        
        .pagination {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .pagination-btn {
          padding: 4px 10px;
          margin: 0 2px;
          border: 1px solid #ddd;
          background-color: #fff;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        
        .pagination-btn:hover:not(:disabled) {
          background-color: #f0f0f0;
        }
        
        .pagination-btn:disabled {
          color: #ccc;
          cursor: not-allowed;
          border-color: #eee;
        }
        
        .pagination-btn.active {
          background-color: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }
        
        .page-numbers {
          display: flex;
          align-items: center;
          margin: 0 5px;
        }
        
        .ellipsis {
          margin: 0 5px;
          font-size: 0.9rem;
        }
        
        .page-info {
          margin-left: 10px;
          font-size: 0.8rem;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .pagination-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-count {
            text-align: center;
            margin-bottom: 10px;
          }
          
          .pagination {
            justify-content: center;
          }
          
          .filter-dropdown {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default SurgeryScheduling;
