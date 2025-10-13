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

// Returns list of disconnected users (socket is disconnected or last activity is more than 1 minute ago)
const stmtGetDisconnectedUsers = db.prepare(`
  SELECT userId FROM users
  WHERE roomId = ?
    AND (disconnected = TRUE OR lastActivityTime < datetime('now', '-1 minute'))
`);

const stmtUpdateSocketId = db.prepare(`
  UPDATE users SET
    socketId     = @socketId
  WHERE userId = @userId
    AND roomId = @roomId
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

exports.GetDisconnectedUsers = roomId => stmtGetDisconnectedUsers.run(roomId);

// Delete user data for inactive / disconnected users.
exports.updateSocketId = (userId, socketId, roomId) => stmtUpdateSocketId.run({userId, socketId, roomId});
