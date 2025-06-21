// Import model helpers
const {
  getRoomById,
  createRoom,
  updateUsers,
} = require('../models/roomModel');

exports.joinOrCreateRoom = (roomId, userId, socketId) => {
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

    if (room.users.size > 10)
      throw new Error(`Too many users in room! Cannot join.`);

    const usersDict = JSON.parse(room.users);

    if (userId in usersDict)
      throw new Error(`userId "${userId}" is already in the room`);

    usersDict[userId] = { socketId };

    updateUsers({
      roomId,
      users: JSON.stringify(usersDict),
    });
  }
};

exports.assignCards = (roomId) => {
  if (!roomId)
    throw new Error('roomId is required.');

  let room = getRoomById(roomId.trim());
  if (!room)
    throw new Error(`requested room ${roomId} does not exist.`);

  let usersDict = JSON.parse(room.users);

  // Generate N distinct random numbers between 1 and 100, inclusive.
  let cardNums = new Set();
  while (cardNums.size < Object.keys(usersDict).length) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    cardNums.add(randomNumber);
  }

  // Assign number to each user.
  for (const userId of Object.keys(usersDict)) {
    const cardNum = cardNums.values().next().value;
    usersDict[userId].card = cardNum;
    cardNums.delete(cardNum);
  }

  // Assign initial ranks to each user.
  let currentRank = 1;
  for (const userId of Object.keys(usersDict)) {
    usersDict[userId].rank = currentRank;
    currentRank++;
  }

  // Update database.
  updateUsers({
    roomId,
    users: JSON.stringify(usersDict),
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

exports.setUserResponse = ({ roomId, userId, response }) => {
  const room = getRoomById(roomId);
  if (!room) return false;

  // Parse, mutate, and write back just the responses array
  const usersDict = JSON.parse(room.users);
  usersDict[userId].response = response;
  updateUsers({
    roomId,
    users: JSON.stringify(usersDict),
  });
};

// Returns responses submitted so far in the specified room.
exports.getSubmittedResponses = (roomId) => {
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }

  const usersDict = JSON.parse(room.users);
  let responses = [];

  for (const userId of Object.keys(usersDict)) {
    if (usersDict[userId].response) {
      responses.push({ userId, response: usersDict[userId].response, rank: usersDict[userId].rank });
    }
  }

  return {
    allResponseSubmitted: Object.keys(usersDict).length == responses.length,
    responses
  };
};

exports.getAllCardsAndResponses = (roomId) => {
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }

  const usersDict = JSON.parse(room.users);
  let responses = [];
  let allCardsOpened = true;

  for (const userId of Object.keys(usersDict)) {
    if (usersDict[userId].response) {
      responses.push({
        userId,
        response: usersDict[userId].response,
        card: usersDict[userId].cardOpened ? usersDict[userId].card : undefined,
        correct: usersDict[userId].correct
      });
    }
    if (!usersDict[userId].cardOpened) {
      allCardsOpened = false;
    }
  }

  return { allCardsOpened, responses };
};

exports.openCard = (roomId, cardOpenedUserId) => {
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }

  const usersDict = JSON.parse(room.users);
  let openedCardIsMinimum = true;

  for (const userId of Object.keys(usersDict)) {
    if (userId == cardOpenedUserId) continue;
    if (usersDict[userId].cardOpened) continue;
    if (usersDict[userId].card < usersDict[cardOpenedUserId].card) {
      // Another user has a card with lower value. The user should not have opened the card.
      openedCardIsMinimum = false;
      break;
    }
  }

  usersDict[cardOpenedUserId].correct = openedCardIsMinimum;
  usersDict[cardOpenedUserId].cardOpened = true;

  updateUsers({
    roomId,
    users: JSON.stringify(usersDict),
  });
};

exports.deleteUserBySocketId = (socketId) => {
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }
  const usersDict = JSON.parse(room.users);
  for (const userId of Object.keys(usersDict)) {
    if (usersDict[userId].socketId === socketId) {
      delete usersDict[userId];
    }
  }
  res.json({
    roomId,
    users: Object.keys(JSON.parse(room.users))
  });
};