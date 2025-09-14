const express = require('express');
const voteController = require('../controllers/voteController');

module.exports = (io) => {
  const router = express.Router();
  const controller = voteController(io);

  // Submit a vote for a specific poll option
  router.post('/', controller.submitVote);

  return router;
};