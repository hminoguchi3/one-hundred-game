// Import the shared SQLite instance
const db = require('../config/sqlite');

// Prepare a reusable statement to fetch a room by ID
const stmtGetUserBySocketId = db.prepare('SELECT * FROM users WHERE socketId = ?');

const stmtGetUsersByRoomId = db.prepare(`
  SELECT *
  FROM users
  WHERE roomId = ?
    AND disconnected IS FALSE
`);

const stmtGetCardByUseId = db.prepare(`
  SELECT cardNumber
  FROM users
  WHERE userId = ?
`);

const stmtDelete = db.prepare(`DELETE FROM users WHERE userId = ?`);

/* INSERT now includes the four new columns */
const stmtInsert = db.prepare(`
  INSERT INTO users
    (userId, socketId, roomId, cardNumber, response, correct, cardOpened, lastActivityTime, disconnected)
  VALUES
    (@userId, @socketId, @roomId, NULL, NULL, NULL, FALSE, datetime('now'), FALSE)
`);

const stmtAssignCard = db.prepare(`
  UPDATE users SET
    cardNumber     = @cardNumber
  WHERE userId = @userId
`);

const stmtSetResponse = db.prepare(`
  UPDATE users SET
    response     = @response
  WHERE userId = @userId
`);

const stmtOpenCard = db.prepare(`
  UPDATE users SET
    cardOpened     = TRUE,
    correct     = @correct
  WHERE userId = @userId
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

const stmtResetRoom = db.prepare(`
  UPDATE users SET
    cardNumber = NULL,
    response = NULL,
    correct = NULL,
    cardOpened = FALSE
  WHERE roomId = ?
`);

// Return the full row (userId, socketId, roomId) or undefined
exports.getUserBySocketId = sockeId => stmtGetUserBySocketId.get(sockeId);

exports.getUsersByRoomId = roomId => stmtGetUsersByRoomId.all(roomId);

exports.getCardByUserId = userId => stmtGetCardByUseId.get(userId);

exports.assignCardToUser = (cardNumber, userId) => stmtAssignCard.run({ cardNumber, userId });

exports.setUserResponse = (response, userId) => stmtSetResponse.run({ response, userId });

exports.openCard = (userId, correct) => stmtOpenCard.run({ userId, correct });

exports.resetUsersInRoom = roomId => stmtResetRoom.run(roomId);

// Delete a room
exports.deleteUserById = userId => stmtDelete.run(userId);

// Insert a brand-new user (called once on creation)
exports.createUser = (userId, socketId, roomId) => stmtInsert.run({ userId, socketId, roomId });

exports.updateLastActivityTime = socketId => stmtUpdateLastActivityTime.run(socketId);

exports.userDisconnected = socketId => stmtUserDisconnected.run(socketId);

// Delete user data for inactive / disconnected users.
exports.cleanUpUsers = () => stmtCleanUpUsers.run();
