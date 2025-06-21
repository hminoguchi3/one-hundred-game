// Import the Express Router helper
const { Router } = require('express');

// Import the controller that will handle the POST
const { getUsersByRoom
 } = require('../controllers/roomController');

// Create a new router instance
const router = Router();

// Bind POST /  →  joinOrCreateRoom
router.get('/:roomId/users', getUsersByRoom)

// Export the router so index.js can mount it
module.exports = router;