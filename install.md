# Installation Guide

This guide will help you set up and run a development version of the project, which consists of a React frontend and a Node.js backend. Before you begin, ensure you have [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

## Step 1: Clone the Repository

First, clone the project repository to your local machine using Git.

```bash
git clone <repository-url>
```

## Step 2: Install Dependencies

You need to install the necessary npm packages for both the frontend and backend.

### Backend
Navigate to the backend directory and install the dependencies.

```bash
cd backend
npm install
```

### Frontend
Next, navigate to the rpleague directory (the frontend folder) and install the dependencies.

```bash
cd ../rpleague
npm install
```

## Step 3: Set Up Mongo DB
You must set up a MongoDB database for the backend to use. If you're new to MongoDB, you can find a getting started guide [here](https://www.mongodb.com/docs/manual/installation/).

After setting up your MongoDB database, update the backend's configuration file (inside .env inside backend folder) with your database connection string.

Remember to update the connection string inside server.js if it's different from the default.

## Step 4: Run the Project
With the dependencies installed, you can now run the development server. Note that the production server is not available yet
as node is not yet configured to host build files.
Cd into rpleague folder and start both servers via npm-run-parallel:
```bash
npm start
```
The project is configured so this command starts both frontend and backend servers concurrently. 
Note, that port 3000 will be used by the backend server. Unforunately, this cannot be changed due to internal limitations. When React asks to use a different port, type 'Y' to allow it to use a different port (Port 3001).


## Additional Information
- The frontend will be accessible at http://localhost:3001 by default.
- Ensure the backend is properly connected to MongoDB for full functionality.
- For production deployment, additional steps will be required, especially for serving the built frontend application, which this guide does not cover.

## Troubleshooting
If you encounter any issues during installation, please first check that you have the latest versions of Node.js and npm installed. Ensure your MongoDB instance is running and correctly configured. For any other issues, consider opening an issue on the GitHub repository, or messaging Team 2 on Discord.

Thank you for installing our project! We hope you find it fun :)
