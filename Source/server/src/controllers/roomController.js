// Import model helpers
const {
  getRoomById,
  createRoom,
  updateRoomUsers
} = require('../models/roomModel');

exports.joinOrCreateRoom = (req, res) => {
  const { roomId, userId, gameType, topic } = req.body;
  if (!roomId || !userId)
    return res.status(400).json({ error: 'roomId and userId are required.' });

  let room = getRoomById(roomId.trim());

  /* ── CREATE ───────────────────────────────────────────────────────── */
  if (!room) {
    room = {
      roomId,
      gameType: gameType || 'defaultGame',
      stage   : 'lobby',

      users   : JSON.stringify([userId]),
      cards   : JSON.stringify([]),
      status  : JSON.stringify([]),
      responses: JSON.stringify(['']),   // one empty response
      ranks    : JSON.stringify([0]),    // one zero rank

      topic: topic || '',
      acceptingNewUsers: 1               // true
    };
    createRoom(room);

  /* ── JOIN EXISTING ────────────────────────────────────────────────── */
  } else {
    if (!room.acceptingNewUsers)          // 0 or 1 from DB
      return res.status(403).json({ error: 'Room is closed to new users.' });

    const usersArr     = JSON.parse(room.users);
    const cardsArr     = JSON.parse(room.cards);
    const statusArr    = JSON.parse(room.status);
    const responsesArr = JSON.parse(room.responses);
    const ranksArr     = JSON.parse(room.ranks);

    if (usersArr.includes(userId))
      return res.status(409).json({ error: `userId "${userId}" is already in the room` });

    /* keep all per-user arrays the same length */
    usersArr.push(userId);
    cardsArr.push(null);
    statusArr.push(0);
    responsesArr.push('');
    ranksArr.push(0);

    updateArrays({
      roomId,
      users     : JSON.stringify(usersArr),
      cards     : JSON.stringify(cardsArr),
      status    : JSON.stringify(statusArr),
      responses : JSON.stringify(responsesArr),
      ranks     : JSON.stringify(ranksArr)
    });

    /* sync local copy so we can send it back */
    Object.assign(room, {
      users     : JSON.stringify(usersArr),
      cards     : JSON.stringify(cardsArr),
      status    : JSON.stringify(statusArr),
      responses : JSON.stringify(responsesArr),
      ranks     : JSON.stringify(ranksArr)
    });
  }

  /* ── RESPONSE ─────────────────────────────────────────────────────── */
  res.json({
    roomId: room.roomId,
    gameType: room.gameType,
    stage: room.stage,

    users:      JSON.parse(room.users),
    cards:      JSON.parse(room.cards),
    status:     JSON.parse(room.status),
    responses:  JSON.parse(room.responses),
    ranks:      JSON.parse(room.ranks),

    topic: room.topic,
    acceptingNewUsers: !!room.acceptingNewUsers   // cast to boolean
  });
};

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
    users: JSON.parse(room.users)
  });
};