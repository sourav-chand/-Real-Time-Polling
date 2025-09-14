const prisma = require('../models/prisma');

const voteController = (io) => ({
  submitVote: async (req, res) => {
    const { userId, pollOptionId } = req.body;

    if (!userId || !pollOptionId) {
      return res.status(400).json({ error: 'Please provide userId and pollOptionId' });
    }

    try {
      // Check if the user has already voted for this poll option
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId_pollOptionId: { userId, pollOptionId },
        },
      });

      if (existingVote) {
        return res.status(409).json({ error: 'User has already voted for this poll option' });
      }

      const vote = await prisma.vote.create({
        data: {
          userId,
          pollOptionId,
        },
        include: {
          pollOption: {
            include: {
              poll: {
                include: {
                  options: {
                    include: { votes: true },
                  },
                },
              },
            },
          },
        },
      });

      // Emit WebSocket event for live updates
      const pollId = vote.pollOption.poll.id;
      const updatedPoll = await prisma.poll.findUnique({
        where: { id: pollId },
        include: {
          options: {
            include: { votes: true },
          },
        },
      });

      io.to(pollId).emit('pollUpdate', updatedPoll);

      res.status(201).json(vote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },
});

module.exports = voteController;