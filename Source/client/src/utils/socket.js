import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../utils/constants';

// Create the socket instance once
export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});