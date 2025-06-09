// Bring in environment variables from .env
require('dotenv').config();

// Import core libraries
const express = require('express');
const cors    = require('cors');

// Import the room router we just wrote
const roomRoutes = require('./routes/roomRoutes');

// Create the Express application
const app = express();

// Use CORS so the front-end can hit the API from another port
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Simple sanity-check endpoint
app.get('/api/hello', (req, res) =>
  res.json({ message: 'Hello from the backend!' })
);

// Mount all room-related routes at /api/room
app.use('/api/room', roomRoutes);

// Read the port from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and log readiness
app.listen(PORT, () =>
  console.log(`API running on http://localhost:${PORT}`)
);

// Socket
const http  = require('http');
const { Server } = require('socket.io');

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"               // loosen in dev; tighten for prod
  }
});

// Socket event hook
io.on('connection', socket => {
  console.log('client connected', socket.id);

  /* join a room (client emits: { roomId, userId }) */
  socket.on('joinRoom', ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`${userId} joined ${roomId}`);
    // notify everyone else in the room
    socket.to(roomId).emit('userJoined', { userId });
  });

  /* cleanup */
  socket.on('disconnect', () => {
    console.log('client disconnected', socket.id);
  });
});

// Start the HTTP server
const SOCKET_PORT = 3001;
httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
});