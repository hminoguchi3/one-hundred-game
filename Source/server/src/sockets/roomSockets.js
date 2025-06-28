function configureSocketIo(app) {
    const http = require('http');
    const { Server } = require('socket.io');

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
        cors: { origin: '*' }
    });

    const {
        joinOrCreateRoom,
        assignCards,
        setUserResponse,
        getSubmittedResponses,
        getAllCardsAndResponses,
        openCard,
        resetRoom,
        deleteUserBySocketId,
        getUsersByRoom
    } = require('../controllers/roomController');

    const { getRoomById, setTopic, stopAcceptingNewUsers } = require('../models/roomModel');
    const { getUserBySocketId } = require('../models/userModel');

    // Socket event hook
    io.on('connection', socket => {
        console.log('client connected', socket.id);

        /* join a room (client emits: { roomId, userId }) */
        socket.on('joinRoom', ({ roomId, userId }) => {
            socket.join(roomId);
            console.log(`${userId} joined ${roomId}`);
            try {
                joinOrCreateRoom(roomId, userId, socket.id);
                // Send the current list of users to everyone in the room.
                const { users } = getUsersByRoom(roomId);
                socket.emit('userJoined', { roomId, users });
                socket.to(roomId).emit('userJoined', { roomId, users });
            } catch (error) {
                socket.emit('socketError', { message: error.message });
            }
        });

        socket.on('startGame', ({ roomId }) => {
            const room = getRoomById(roomId);
            if (!room) {
                return socket.emit('socketError', { message: 'room not found' });
            }
            usersDict = JSON.parse(room.users)
            if (Object.keys(usersDict).length <= 1) {
                return socket.emit('tooFewUsersError', { message: 'You need at least 2 people to play.' });
            }
            stopAcceptingNewUsers(roomId);
            assignCards(roomId);
            io.to(roomId).emit('startGame', { roomId });   // broadcast
        });

        /* set a room topic */
        socket.on('setTopic', ({ roomId, userId, topic }) => {
            const room = getRoomById(roomId);
            if (!room) {
                return socket.emit('socketError', { message: 'room not found' });
            }
            setTopic({ roomId, topic });            // write to DB
            const usersDict = JSON.parse(room.users);
            // Send cards to all users.
            for (const receiverUserId in usersDict) {
                const userInfo = usersDict[receiverUserId];
                io.to(userInfo.socketId).emit('topicSubmitted', { topicGivenUserId: userId, topic, card: userInfo.card });
            }
        });

        // Called when a user submitted a response.
        socket.on('submitResponse', ({ roomId, userId, response }) => {
            setUserResponse({ roomId, userId, response }); // DB update
            const { allResponseSubmitted, responses } = getSubmittedResponses(roomId);
            io.to(roomId).emit('responseUpdated', { allResponseSubmitted, responses });
        });

        socket.on('openCard', ({ roomId, userId }) => {
            openCard(roomId, userId);
            io.to(roomId).emit('cardOpened', getAllCardsAndResponses(roomId));
        });

        socket.on('playAgain', ({ roomId }) => {
            resetRoom(roomId);
            io.to(roomId).emit('playAgain', {});
        });

        /* cleanup */
        socket.on('disconnect', () => {
            console.log('client disconnected', socket.id);
            const user = getUserBySocketId(socket.id);
            if (user === undefined) return;
            const { roomId } = user;
            deleteUserBySocketId(socket.id);

            const room = getRoomById(roomId);
            if (!room) {
                return socket.emit('socketError', { message: 'room not found' });
            }
            usersDict = JSON.parse(room.users)

            // Refresh current list of users and responses.
            const { users } = getUsersByRoom(roomId);
            io.to(roomId).emit('userJoined', { roomId, users });
            io.to(roomId).emit('responseUpdated', getSubmittedResponses(roomId));
            io.to(roomId).emit('cardOpened', getAllCardsAndResponses(roomId));

            if (Object.keys(usersDict).length <= 1) {
                const acceptingNewUsers = room.acceptingNewUsers;
                return io.to(roomId).emit(
                    'everyoneElseDisconnectedError',
                    { gameOngoing: !acceptingNewUsers, message: 'Everyone else disconnected - you are the only one left.' }
                );
            }
        });
    });

    // Start the HTTP server
    const SOCKET_PORT = process.env.PORT || 5000;
    httpServer.listen(SOCKET_PORT, () => {
        console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
    });
}

module.exports = { configureSocketIo };