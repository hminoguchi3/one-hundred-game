// Load path from environment variables
// (The first require of dotenv should be in index.js; we assume it's already run)

// Import the better-sqlite3 driver
const Database = require('better-sqlite3');

// Open or create the DB file specified in .env
const db = new Database(process.env.DB_PATH);

// Create the rooms table if it doesn’t exist yet
db.exec(`                 -- SQL begins
  CREATE TABLE IF NOT EXISTS rooms (
    roomId   TEXT PRIMARY KEY,       -- Room name / code
    gameType TEXT DEFAULT 'defaultGame',
    stage    TEXT DEFAULT 'lobby',   -- lobby → playing → finished
    users    TEXT                    -- JSON array of user IDs
  )
`);

// Export the opened database object to the rest of the app
module.exports = db;