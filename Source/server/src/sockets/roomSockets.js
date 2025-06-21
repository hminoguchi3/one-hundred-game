function configureSocketIo(app) {
    const http = require('http');
    const { Server } = require('socket.io');

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000"               // loosen in dev; tighten for prod
        }
    });

    const {
        joinOrCreateRoom,
        assignCards,
        setUserResponse,
        getSubmittedResponses,
        getAllCardsAndResponses,
        openCard,
        resetRoom,
        deleteUserBySocketId
    } = require('../controllers/roomController');

    const { getRoomById, setTopic } = require('../models/roomModel');

    // Socket event hook
    io.on('connection', socket => {
        console.log('client connected', socket.id);

        /* join a room (client emits: { roomId, userId }) */
        socket.on('joinRoom', ({ roomId, userId }) => {
            socket.join(roomId);
            console.log(`${userId} joined ${roomId}`);
            try {
                joinOrCreateRoom(roomId, userId, socket.id);
                // Notify everyone else in the room
                socket.to(roomId).emit('userJoined', { userId, roomId });
            } catch (error) {
                socket.emit('socketError', { message: error.message });
            }
        });

        socket.on('startGame', ({ roomId }) => {
            const room = getRoomById(roomId);
            if (!room) {
                return socket.emit('socketError', { message: 'room not found' });
            }
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
            // deleteUserBySocketId(socket.id);
        });
    });

    // Start the HTTP server
    const SOCKET_PORT = 3001;
    httpServer.listen(SOCKET_PORT, () => {
        console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
    });
}

module.exports = { configureSocketIo };