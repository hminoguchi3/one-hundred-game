// Import the shared SQLite instance
const db = require('../config/sqlite');

// Prepare a reusable statement to fetch a room by ID
const stmtGet = db.prepare('SELECT * FROM rooms WHERE roomId = ?');

/* INSERT now includes the four new columns */
const stmtInsert = db.prepare(`
  INSERT INTO rooms
    (roomId, gameType, stage,
     users, cards, status,
     topic, responses, ranks, acceptingNewUsers)
  VALUES
    (@roomId, @gameType, @stage,
     @users, @cards, @status,
     @topic, @responses, @ranks, @acceptingNewUsers)
`);

/* single UPDATE for all array-type columns (users, cards, status, responses, ranks) */
const stmtUpdateArrays = db.prepare(`
  UPDATE rooms SET
    users     = @users,
    cards     = @cards,
    status    = @status,
    responses = @responses,
    ranks     = @ranks
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

// exports.setUserNumber = ({ roomId, userIndex, number }) => {
//   // Fetch the current row
//   const room = stmtGet.get(roomId);
//   if (!room) return false;

//   // Parse, mutate, and write back just the responses array
//   const responsesArr = JSON.parse(room.responses);
//   responsesArr[userIndex].number = response;

//   stmtUpdateArrays.run({
//     roomId,
//     users     : room.users,                    // untouched
//     cards     : room.cards,
//     status    : room.status,
//     responses : JSON.stringify(responsesArr),
//     ranks     : room.ranks
//   });

//   return true;
// };

/**
 * Replace one element of the responses[] array for a given user index.
 * Returns true on success, false if the room isn’t found.
 */
exports.setUserResponse = ({ roomId, userIndex, response }) => {
  // Fetch the current row
  const room = stmtGet.get(roomId);
  if (!room) return false;

  // Parse, mutate, and write back just the responses array
  const responsesArr = JSON.parse(room.responses);
  responsesArr[userIndex] = response;

  stmtUpdateArrays.run({
    roomId,
    users     : room.users,                    // untouched
    cards     : room.cards,
    status    : room.status,
    responses : JSON.stringify(responsesArr),
    ranks     : room.ranks
  });

  return true;
};