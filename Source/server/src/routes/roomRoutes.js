// Import the Express Router helper
const { Router } = require('express');

// Import the controller that will handle the POST
const { joinOrCreateRoom } = require('../controllers/roomController');

// Create a new router instance
const router = Router();

// Bind POST /  →  joinOrCreateRoom
router.post('/', joinOrCreateRoom);

// Export the router so index.js can mount it
module.exports = router;