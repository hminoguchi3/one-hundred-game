// Import the shared SQLite instance
const db = require('../config/sqlite');

// Prepare a reusable statement to fetch a room by ID
const stmtGet = db.prepare('SELECT * FROM rooms WHERE roomId = ?');

// Prepare an insert (runs only when room doesn’t exist yet)
const stmtInsert = db.prepare(`
  INSERT INTO rooms (roomId, gameType, stage, users, cards)
  VALUES (@roomId, @gameType, @stage, @users, @cards)
`);

// Prepare an update of the users list
const stmtUpdateUsers = db.prepare(`
  UPDATE rooms SET users = @users, cards = @cards
  WHERE roomId = @roomId
`);

// Export a helper that returns a JS object or undefined
exports.getRoomById = (roomId) => stmtGet.get(roomId);

// Export a helper that creates a new room document
exports.createRoom = (roomObj) => stmtInsert.run(roomObj);

// Export a helper that replaces the users array
exports.updateRoomUsers = ({ roomId, users, cards }) =>
  stmtUpdateUsers.run({ roomId, users, cards });