// Load path from environment variables
// (The first require of dotenv should be in index.js; we assume it's already run)

// Added by Hajime
const fs   = require('fs');
const path = require('path');

// Import the better-sqlite3 driver
const Database = require('better-sqlite3');

// Added by Hajime
const dbFile = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'rooms.db');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

// Open or create the DB file specified in .env
const db = new Database(process.env.DB_PATH);

// Create the rooms table if it doesn’t exist yet
db.exec(`                 -- SQL begins
  CREATE TABLE IF NOT EXISTS rooms (
    roomId   TEXT PRIMARY KEY,       -- Room name / code
    gameType TEXT DEFAULT 'defaultGame',
    stage    TEXT DEFAULT 'lobby',   -- lobby → playing → finished
    users    TEXT,                   -- JSON array of user IDs
    topic              TEXT DEFAULT '',
    acceptingNewUsers  INTEGER DEFAULT 1   -- 1=true, 0=false
  )
`);

db.exec(`                 -- SQL begins
  CREATE TABLE IF NOT EXISTS users (
    userId   TEXT PRIMARY KEY,       -- User name
    roomId   TEXT,       -- Room name / code
    socketId   TEXT
  )
`);

// Export the opened database object to the rest of the app
module.exports = db;