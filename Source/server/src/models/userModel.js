// Import the shared SQLite instance
const db = require('../config/sqlite');

// Prepare a reusable statement to fetch a room by ID
const stmtGetBySocketId = db.prepare('SELECT * FROM users WHERE socketId = ?');

const stmtDelete = db.prepare(`DELETE FROM users WHERE userId = ?`);

/* INSERT now includes the four new columns */
const stmtInsert = db.prepare(`
  INSERT INTO users
    (userId, socketId, roomId, lastActivityTime, disconnected)
  VALUES
    (@userId, @socketId, @roomId, datetime('now'), FALSE)
`);

const stmtUpdateLastActivityTime = db.prepare(`
  UPDATE users SET
    lastActivityTime     = datetime('now')
  WHERE socketId = ?
`);

const stmtUserDisconnected = db.prepare(`
  UPDATE users SET
    disconnected     = TRUE
  WHERE socketId = ?
`);

// Delete user data after 1 hour of inactivity.
const stmtCleanUpUsers = db.prepare(`
  DELETE FROM users
  WHERE lastActivityTime < datetime('now', '-1 hour');
`);

// Return the full row (userId, socketId, roomId) or undefined
exports.getUserBySocketId = sockeId => stmtGetBySocketId.get(sockeId);

// Delete a room
exports.deleteUserById = userId => stmtDelete.run(userId);

// Insert a brand-new user (called once on creation)
exports.createUser = (userId, socketId, roomId) => stmtInsert.run({ userId, socketId, roomId });

exports.updateLastActivityTime = socketId => stmtUpdateLastActivityTime.run(socketId);

exports.userDisconnected = socketId => stmtUserDisconnected.run(socketId);

// Delete user data for inactive / disconnected users.
exports.cleanUpUsers = () => stmtCleanUpUsers.run();
