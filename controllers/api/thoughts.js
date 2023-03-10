const { Router } = require('express');
const Thought = require('../../models/Thought');
const User = require('../../models/User');

const thoughtsRouter = new Router();

thoughtsRouter
    .route('/')
    .get(async (req, res) => {
        const thoughts = await Thought.find({});
        res.json(thoughts);
    })
    .post(async (req, res) => {
        const { thoughtText, username, userId } = req.body;
        const thought = new Thought({
            thoughtText,
            username,
            userId,
        });

        await thought.save();
        const user = await User.findOneAndUpdate(
            { username: username },
            { $push: { thoughts: thought.id } },
            { new: true }
        );

        console.log(user);
        await user.save();

        res.json(thought);
    });

thoughtsRouter
    .route('/:id')
    .get(async (req, res) => {
        const { id } = req.params;
        const thought = await Thought.findById(id);
        res.json(thought);
    })
    .put(async (req, res) => {
        const { id } = req.params;
        const { thoughtText } = req.body;
        const thought = await Thought.findByIdAndUpdate(
            id,
            { thoughtText },
            {
                new: true,
            }
        );
        await thought.save();
        res.json(thought);
    })
    .delete(async (req, res) => {
        const { id } = req.params;
        const thought = await Thought.findByIdAndDelete(id);
        res.json(thought);
    });

thoughtsRouter
    .route('/:thoughtId/reactions')
    .post(async (req, res) => {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;

        const thought = await Thought.findByIdAndUpdate(
            thoughtId,
            {
                $push: { reactions: { reactionBody, username } },
            },
            { new: true }
        );

        console.log(thought.reactions);
        res.json(thought);
    })
    .delete(async (req, res) => {
        const { thoughtId } = req.params;
        const { reactionId } = req.body;
        console.log(reactionId);

        const thought = await Thought.findByIdAndUpdate(
            thoughtId,
            {
                $pull: { reactions: { reactionId: reactionId } },
            },
            { new: true }
        );

        res.json(thought);
    });

module.exports = thoughtsRouter;
