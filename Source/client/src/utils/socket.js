import { io } from 'socket.io-client';

// Create the socket instance once
export const socket = io(process.env.REACT_APP_SOCKET_URL, {
  autoConnect: false,
});