// Import the shared SQLite instance
const db = require('../config/sqlite');

// Prepare a reusable statement to fetch a room by ID
const stmtGet = db.prepare('SELECT * FROM rooms WHERE roomId = ?');

/* INSERT now includes the four new columns */
const stmtInsert = db.prepare(`
  INSERT INTO rooms
    (roomId, gameType, stage,
     users, topic, acceptingNewUsers)
  VALUES
    (@roomId, @gameType, @stage,
     @users, @topic, @acceptingNewUsers)
`);

const stmtUpdateArrays = db.prepare(`
  UPDATE rooms SET
    users     = @users
  WHERE roomId = @roomId
`);

const stmtUpdateTopic = db.prepare(`
  UPDATE rooms SET
    topic     = @topic
  WHERE roomId = @roomId
`);

// Return the full row or undefined
exports.getRoomById = roomId => stmtGet.get(roomId);

// Insert a brand-new room (called once on creation)
exports.createRoom = roomObj => stmtInsert.run(roomObj);

// Replace *all* array columns at once
exports.updateArrays = payload => stmtUpdateArrays.run(payload);

// Set/overwrite the single topic string
exports.setTopic = ({ roomId, topic }) =>
  stmtUpdateTopic.run({ roomId, topic });