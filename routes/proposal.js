const express = require('express');
const router = express.Router();
const multer = require('multer');
const { checkAuth } = require('../middleware/auth');
const proposalController = require('../controllers/proposal.controller');

const upload = multer({ storage: multer.memoryStorage() });

// Submit proposal - uses checkAuth to identify the user
router.post('/submit', checkAuth, upload.single('document'), proposalController.uploadProposal);

// Dashboard retrieval - uses checkAuth to get ONLY that user's data
router.get('/my-submissions', checkAuth, proposalController.getMyProposals);

// AI validation
router.post('/validate', checkAuth, proposalController.validateOriginality);

// Search (Usually public or requires auth)
router.get('/search', proposalController.searchProposals);

module.exports = router;