// Import the shared SQLite instance
const db = require('../config/sqlite');

// Prepare a reusable statement to fetch a room by ID
const stmtGetBySocketId = db.prepare('SELECT * FROM users WHERE socketId = ?');

const stmtDelete = db.prepare(`DELETE FROM users WHERE userId = ?`);

/* INSERT now includes the four new columns */
const stmtInsert = db.prepare(`
  INSERT INTO users
    (userId, socketId, roomId)
  VALUES
    (@userId, @socketId, @roomId)
`);

// Return the full row (userId, socketId, roomId) or undefined
exports.getUserBySocketId = sockeId => stmtGetBySocketId.get(sockeId);

// Delete a room
exports.deleteUserById = userId => stmtDelete.run(userId);

// Insert a brand-new user (called once on creation)
exports.createUser = (userId, socketId, roomId) => stmtInsert.run({ userId, socketId, roomId });
