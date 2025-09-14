const prisma = require('../models/prisma');

const pollController = {
  createPoll: async (req, res) => {
    const { question, options, creatorId } = req.body;
    if (!question || !options || options.length < 2 || !creatorId) {
      return res.status(400).json({ error: 'Please provide a question, at least two options, and a creatorId' });
    }

    try {
      const poll = await prisma.poll.create({
        data: {
          question,
          creator: { connect: { id: creatorId } },
          options: {
            create: options.map(optionText => ({ text: optionText }))
          },
        },
        include: { options: true },
      });
      res.status(201).json(poll);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  getAllPolls: async (req, res) => {
    try {
      const polls = await prisma.poll.findMany({
        include: { options: true, creator: { select: { id: true, name: true } } },
      });
      res.status(200).json(polls);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },

  getPollById: async (req, res) => {
    const { id } = req.params;
    try {
      const poll = await prisma.poll.findUnique({
        where: { id },
        include: { options: true, creator: { select: { id: true, name: true } } },
      });

      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.status(200).json(poll);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  },
};

module.exports = pollController;