// Import model helpers
const {
  getRoomById,
  createRoom,
  updateRoomUsers
} = require('../models/roomModel');

// Export the main “join or create” handler
exports.joinOrCreateRoom = (req, res) => {
  // Extract values sent by the client
  const { roomId, userId, gameType } = req.body;

  // Validate presence of mandatory fields
  if (!roomId || !userId) {
    return res.status(400).json({ error: 'roomId and userId are required.' });
  }

  // Try to find an existing room
  let room = getRoomById(roomId);

  // If room doesn’t exist, create it
  if (!room) {
    // Build the initial room object
    room = {
      roomId,
      gameType: gameType || 'defaultGame',
      stage:    'lobby',
      users:    JSON.stringify([userId]),   // store array as JSON text
      cards:    JSON.stringify([null]),
      status:   JSON.stringify([0])
    };

    // Persist to the DB
    createRoom(room);

  } else {
    // Parse the stored JSON string to an array
    const usersArr = JSON.parse(room.users);
    const cardsArr = JSON.parse(room.cards);
    const statusArr = JSON.parse(room.status);

    if (usersArr.includes(userId)) {
      res.json({ error: `User ID is already used` });
    }

    // Add the user only if not already present
    if (!usersArr.includes(userId)) {
      usersArr.push(userId);
      cardsArr.push(null);
      statusArr.push(0);

      // Save the updated list back to the DB (store as JSON string)
      updateRoomUsers({ roomId, 
      users: JSON.stringify(usersArr),
      cards: JSON.stringify(cardsArr),
      status: JSON.stringify(statusArr)});

      // Keep the in-memory copy in sync so we can send it back
      room.users = JSON.stringify(usersArr);
      room.cards = JSON.stringify(cardsArr);
      room.status = JSON.stringify(statusArr);
    }
  }

  // Respond with the full room object, converting users back to an array
  res.json({
    ...room,
    users: JSON.parse(room.users),
    cards: JSON.parse(room.cards),
    status: JSON.parse(room.status)
  });
};