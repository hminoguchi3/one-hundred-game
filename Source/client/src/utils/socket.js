import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from './constants';

// Create the socket instance once
export const socket = io(SOCKET_SERVER_URL, {
  //transports: ['websocket'],
  autoConnect: false
});