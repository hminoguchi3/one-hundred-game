// Import model helpers
const {
  getRoomById,
  createRoom,
  updateArrays,
} = require('../models/roomModel');

exports.joinOrCreateRoom = (roomId, userId, socketId) => {
  console.log("joinOrCreateRoom!");
  if (!roomId || !userId || !socketId)
    throw new Error('roomId, userId, and socketId are required.');

  let room = getRoomById(roomId.trim());

  /* ── CREATE ───────────────────────────────────────────────────────── */
  if (!room) {
    let userInfoDict = {};
    userInfoDict[userId] = { socketId };
    room = {
      roomId,
      gameType: 'defaultGame',
      stage: 'lobby',

      users: JSON.stringify(userInfoDict),

      topic: '',
      acceptingNewUsers: 1               // true
    };
    createRoom(room);

    /* ── JOIN EXISTING ────────────────────────────────────────────────── */
  } else {
    if (!room.acceptingNewUsers)          // 0 or 1 from DB
      throw new Error('Room is closed to new users.');

    const usersDict = JSON.parse(room.users);

    if (userId in usersDict)
      throw new Error(`userId "${userId}" is already in the room`);

    usersDict[userId] = { socketId };

    updateArrays({
      roomId,
      users: JSON.stringify(usersDict),
    });

    /* sync local copy so we can send it back */
    Object.assign(room, {
      users: JSON.stringify(usersDict),
    });
  }

  /* ── RESPONSE ─────────────────────────────────────────────────────── */
  return {
    roomId: room.roomId,
    acceptingNewUsers: !!room.acceptingNewUsers   // cast to boolean
  };
};

// Returns names of the users in a room.
exports.getUsersByRoom = (req, res) => {
  const { roomId } = req.params;

  // Look up the room
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }

  // Send back the array (parse JSON column)
  res.json({
    roomId,
    users: Object.keys(JSON.parse(room.users))
  });
};