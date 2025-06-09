// src/services/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001'; // Replace with your server URL

const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't auto-connect, connect when needed
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log('Attempting to connect to socket...');
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected.');
  }
};

export const getSocket = () => socket;

export default socket; // Export the socket instance directly as well