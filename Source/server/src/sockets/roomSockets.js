function configureSocketIo(app) {
    const http = require('http');
    const { Server } = require('socket.io');

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000"               // loosen in dev; tighten for prod
        }
    });

    const { joinOrCreateRoom, assignCards } = require('../controllers/roomController');

    const { getRoomById, setTopic, setUserResponse } = require('../models/roomModel');

    // Socket event hook
    io.on('connection', socket => {
        console.log('client connected', socket.id);

        /* join a room (client emits: { roomId, userId }) */
        socket.on('joinRoom', ({ roomId, userId }) => {
            socket.join(roomId);
            console.log(`${userId} joined ${roomId}`);
            try {
                joinOrCreateRoom(roomId, userId, socket.id);
                // notify everyone else in the room
                socket.to(roomId).emit('userJoined', { userId, roomId });
            } catch (error) {
                socket.emit('socketError', { message: error.message });
            }
        });

        socket.on('startGame', ({ roomId }) => {
            const room = getRoomById(roomId);
            if (!room) {
                return socket.emit('error', 'room not found');
            }
            assignCards(roomId);
            io.to(roomId).emit('startGame', { roomId });   // broadcast
        });

        /* set a room topic */
        socket.on('setTopic', ({ roomId, userId, topic }) => {
            const room = getRoomById(roomId);
            if (!room) {
                return socket.emit('error', 'room not found');
            }
            setTopic({ roomId, topic });            // write to DB
            const usersDict = JSON.parse(room.users);
            // Send cards to all users.
            for (const receiverUserId in usersDict) {
                const userInfo = usersDict[receiverUserId];
                io.to(userInfo.socketId).emit('topicUpdated', { userId, topic, card: userInfo.card });
            }
        });

        /* Send a response for each user */
        socket.on('submitResponse', ({ roomId, userId, response }) => {
            const room = getRoomById(roomId);
            if (!room) {
                return socket.emit('error', 'room not found');
            }
            setUserResponse({ roomId, userId, response }); // DB update
            io.to(roomId).emit('responseUpdated', { userId, response });
        });

        /* cleanup */
        socket.on('disconnect', () => {
            console.log('client disconnected', socket.id);
        });
    });

    // Start the HTTP server
    const SOCKET_PORT = 3001;
    httpServer.listen(SOCKET_PORT, () => {
        console.log(`Socket.IO server listening on port ${SOCKET_PORT}`);
    });
}

module.exports = { configureSocketIo };