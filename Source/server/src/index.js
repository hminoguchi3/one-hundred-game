// Bring in environment variables from .env
require('dotenv').config();

// Import core libraries
const express = require('express');
const cors = require('cors');

// Create the Express application
const app = express();

// Use CORS so the front-end can hit the API from another port
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Socket
const { configureSocketIo } = require('./sockets/roomSockets');
configureSocketIo(app);
