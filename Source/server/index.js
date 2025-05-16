// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // JSON形式のデータを扱えるようにする

app.get('/api/hello', (req, res) => {
res.json({ message: 'Hello from the backend!' });
});

/**
 * POST /api/room
 * Body : { roomId: "<room identifier entered by the user>" }
 * Returns: { message: "..." }
 */
app.post('/api/room', (req, res) => {
  const { roomId } = req.body;

  // Basic validation ----------------------------------------------------
  if (!roomId || typeof roomId !== 'string') {
    return res.status(400).json({ error: 'Room ID is missing or invalid.' });
  }

  // TODO:  Insert real room-joining logic here (database lookup, etc.)

  // Reply to the client
  res.json({ message: `Server received Room ID: ${roomId}` });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});