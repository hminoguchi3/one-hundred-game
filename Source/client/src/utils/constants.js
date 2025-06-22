//export const API_BASE_URL = 'http://localhost:5000';
//export const SOCKET_SERVER_URL = 'http://localhost:3001';


//export const API_BASE_URL =
  //process.env.REACT_APP_API_URL || 'http://localhost:5000';
  //process.env.REACT_APP_API_URL;


export const SOCKET_SERVER_URL =
  //process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';   // <— same host by default
  process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
