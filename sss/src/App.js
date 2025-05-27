// sss/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SurgeryScheduling from './components/SurgeryScheduling';

function App() {
  const [openemrVersion, setOpenemrVersion] = useState(null);
  const [pmsVersion, setPmsVersion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const [openemrRes, pmsRes] = await Promise.all([
          fetch('/api/openemr/version'),
          fetch('/api/pms/version')
        ]);

        const [openemrData, pmsData] = await Promise.all([
          openemrRes.json(),
          pmsRes.json()
        ]);

        setOpenemrVersion(openemrData.version);
        setPmsVersion(pmsData.version);
      } catch (error) {
        console.error('Error fetching versions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo-container">
          <img src="assets/s4.png" alt="S4 Logo" className="logo" />
          <h1>Practice Management System</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/surgery-scheduling">Surgery Scheduling</Link></li>
            {/* Add more navigation items as needed */}
          </ul>
        </nav>
      </header>
      
      <main className="app-content">
        <Routes>
          <Route path="/" element={
            loading ? (
              <p>Loading...</p>
            ) : (
              <div className="dashboard">
                <h2>Database Connections</h2>
                <p>OpenEMR Version: {openemrVersion}</p>
                <p>PMS Version: {pmsVersion}</p>
              </div>
            )}
          />
          <Route path="/surgery-scheduling" element={<SurgeryScheduling />} />
        </Routes>
      </main>
      
      <style jsx="true">{`
        .app-header {
          background-color: #282c34;
          padding: 1rem 2rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .logo {
          height: 50px;
          width: auto;
          max-width: 100%;
          object-fit: contain;
        }
        
        .main-nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 1.5rem;
        }
        
        .main-nav a {
          color: white;
          text-decoration: none;
          font-size: 1.1rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .main-nav a:hover {
          background-color: #3a3f4b;
        }
        
        .app-content {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .dashboard {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default App;