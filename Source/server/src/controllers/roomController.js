// Import model helpers
const {
  getRoomById,
  deleteRoomById,
  createRoom,
  setTopic,
  acceptNewUsers,
} = require('../models/roomModel');

const {
  getUserBySocketId,
  deleteUserById,
  createUser,
  getUsersByRoomId,
  assignCardToUser,
  setUserResponse,
  openCard,
  getCardByUserId,
  resetUsersInRoom,
} = require('../models/userModel');

exports.joinOrCreateRoom = (roomId, userId, socketId) => {
  if (!roomId || !userId || !socketId)
    throw new Error('roomId, userId, and socketId are required.');

  let room = getRoomById(roomId);

  /* ── CREATE ───────────────────────────────────────────────────────── */
  if (!room) {
    room = {
      roomId,
      gameType: 'defaultGame',
      stage: 'lobby',

      topic: '',
      acceptingNewUsers: 1               // true
    };
    createRoom(room);

    /* ── JOIN EXISTING ────────────────────────────────────────────────── */
  } else {
    if (!room.acceptingNewUsers)          // 0 or 1 from DB
      throw new Error('This room is hosting ongoing game - no longer accepting new users.');

    const users = getUsersByRoomId(roomId);
    if (users.length >= 10)
      throw new Error(`Too many users in room! Cannot join.`);

    // Duplicate userId will be handled when inserting into users table because
    // userId is a primary key.
  }

  createUser(userId, socketId, roomId);
};

exports.assignCards = (roomId) => {
  if (!roomId)
    throw new Error('roomId is required.');

  const users = getUsersByRoomId(roomId);

  // Generate N distinct random numbers between 1 and 100, inclusive.
  let cardNums = new Set();
  while (cardNums.size < users.length) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    cardNums.add(randomNumber);
  }

  // Assign number to each user.
  for (const user of users) {
    const cardNum = cardNums.values().next().value;
    assignCardToUser(cardNum, user.userId);
    cardNums.delete(cardNum);
  }
};

// Returns names of the users in a room.
exports.getUserIdsByRoom = (roomId) => {
  // Look up the room
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }

  const userIds = getUsersByRoomId(roomId).map(user => {
    return user.userId;
  });

  return {
    roomId,
    users: userIds
  };
};

exports.setUserResponse = ({ roomId, userId, response }) => {
  const room = getRoomById(roomId);
  if (!room) return false;
  setUserResponse(response, userId);
};

// Returns responses submitted so far in the specified room.
exports.getSubmittedResponses = (roomId) => {
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }

  const users = getUsersByRoomId(roomId)
  let responses = [];

  for (const user of users) {
    if (user.response) {
      responses.push({ userId: user.userId, response: user.response });
    }
  }

  return {
    allResponseSubmitted: users.length == responses.length,
    responses
  };
};

exports.getAllCardsAndResponses = (roomId) => {
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }

  let responses = [];
  let allCardsOpened = true;

  for (const user of getUsersByRoomId(roomId)) {
    if (user.response) {
      responses.push({
        userId: user.userId,
        response: user.response,
        card: user.cardOpened ? user.cardNumber : undefined,
        correct: user.correct
      });
    }
    if (!user.cardOpened) {
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

  let openedCardIsMinimum = true;
  const openedCard = getCardByUserId(cardOpenedUserId).cardNumber;

  for (const user of getUsersByRoomId(roomId)) {
    if (user.userId == cardOpenedUserId) continue;
    if (user.cardOpened) continue;
    if (user.cardNumber < openedCard) {
      openedCardIsMinimum = false;
      // Another user has a card with lower value. The user should not have opened the card.
      break;
    }
  }

  openCard(cardOpenedUserId, openedCardIsMinimum ? 1 : 0);
};

exports.resetRoom = (roomId) => {
  const room = getRoomById(roomId);
  if (!room) {
    return res.status(404).json({ error: `room "${roomId}" not found` });
  }
  resetUsersInRoom(roomId);
  setTopic({ roomId, topic: undefined });
  acceptNewUsers(roomId);
};

exports.deleteUserBySocketId = (socketId) => {
  const user = getUserBySocketId(socketId);
  if (!user) return;
  const { roomId, userId } = user;

  deleteUserById(userId);

  if (getUsersByRoomId(roomId).length <= 0) {
    // No more users left in the room.
    deleteRoomById(roomId);
  }
};