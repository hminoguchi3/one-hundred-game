// Import model helpers
const {
  getRoomById,
  createRoom,
  updateArrays,
} = require('../models/roomModel');

exports.joinOrCreateRoom = (req, res) => {
  const { roomId, userId, gameType, topic } = req.body;
  if (!roomId || !userId)
    return res.status(400).json({ error: 'roomId and userId are required.' });

  let room = getRoomById(roomId.trim());

  /* ── CREATE ───────────────────────────────────────────────────────── */
  if (!room) {
    let userInfoDict = {};
    userInfoDict[userId] = {};
    room = {
      roomId,
      gameType: gameType || 'defaultGame',
      stage: 'lobby',

      users: JSON.stringify(userInfoDict),

      topic: topic || '',
      acceptingNewUsers: 1               // true
    };
    createRoom(room);

    /* ── JOIN EXISTING ────────────────────────────────────────────────── */
  } else {
    if (!room.acceptingNewUsers)          // 0 or 1 from DB
      return res.status(403).json({ error: 'Room is closed to new users.' });

    const usersDict = JSON.parse(room.users);

    if (userId in usersDict)
      return res.status(409).json({ error: `userId "${userId}" is already in the room` });

    usersDict[userId] = {};

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
  res.json({
    roomId: room.roomId,
    users: Object.keys(JSON.parse(room.users)),
    acceptingNewUsers: !!room.acceptingNewUsers   // cast to boolean
  });
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