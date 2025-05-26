# Practice Management System

A comprehensive practice management system with surgery scheduling capabilities, built with React and Node.js.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL database

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `s4-api` directory:
   ```
   cd s4-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `s4-api` directory with your database credentials:
   ```
   DB_SERVER=your_database_host
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_PORT=3306
   ```

4. Start the backend server:
   ```
   node server.js
   ```
   The API will be available at `http://localhost:3001`

### 2. Frontend Setup

1. In a new terminal, navigate to the project root directory:
   ```
   cd ..
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Features

- View pending surgery requests
- Filter and sort surgery requests
- View detailed patient and procedure information
- Track surgery status and clearance

## Project Structure

- `/s4-api` - Backend API server
  - `/config` - Database configuration
  - `/routes` - API routes
  - `server.js` - Main server file
- `/public` - Static files
- `/src` - Frontend React application
  - `/components` - Reusable React components
  - `App.js` - Main application component
  - `index.js` - Application entry point

## Troubleshooting

If you encounter permission issues when running npm scripts:

1. Open PowerShell as Administrator
2. Run the following command:
   ```
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Confirm with 'Y' when prompted

## License

This project is proprietary and confidential.
