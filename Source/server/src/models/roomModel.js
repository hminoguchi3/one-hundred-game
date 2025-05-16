// Import the shared SQLite instance
const db = require('../config/sqlite');

// Prepare a reusable statement to fetch a room by ID
const stmtGet = db.prepare('SELECT * FROM rooms WHERE roomId = ?');

// Prepare an insert (runs only when room doesn’t exist yet)
const stmtInsert = db.prepare(`
  INSERT INTO rooms (roomId, gameType, stage, users)
  VALUES (@roomId, @gameType, @stage, @users)
`);

// Prepare an update of the users list
const stmtUpdateUsers = db.prepare(`
  UPDATE rooms SET users = @users WHERE roomId = @roomId
`);

// Export a helper that returns a JS object or undefined
exports.getRoomById = (roomId) => stmtGet.get(roomId);

// Export a helper that creates a new room document
exports.createRoom = (roomObj) => stmtInsert.run(roomObj);

// Export a helper that replaces the users array
exports.updateRoomUsers = ({ roomId, users }) =>
  stmtUpdateUsers.run({ roomId, users });