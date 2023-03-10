const { Router } = require('express');
const Thought = require('../../models/Thought');
const usersRouter = new Router();
const User = require('../../models/User');

/**
 *
 *  @method GET
 *
 *  Gets all users
 *
 *  @returns {Object} - An array of users
 *
 * *
 *
 *  @method POST
 *
 *  Creates a new user
 *
 *  @returns {Object} - The new user
 *
 * */
usersRouter
    .route('/')

    .get(async (req, res) => {
        try {
            const users = await User.find({});
            res.json(users);
        } catch (error) {
            console.log(error.message);
            res.json({ message: error.message });
        }
    })

    .post(async (req, res) => {
        try {
            const newUser = new User(req.body);
            await newUser.save();
            res.json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

/**
 * @method GET
 * Finds a single user by their ID
 * @returns {Object} - user
 *
 * @method PUT
 * Updates a user by their ID
 * @returns {Object} - Updated user
 *
 * @method DELETE
 * Deletes a user from the database, along with their associated Thoughts.
 * @returns {Object} - Deleted user
 * */
usersRouter
    .route('/:id')

    .get(async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            res.json(user);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ message: error.message });
        }
    })

    .put(async (req, res) => {
        const { id } = req.params;
        const { username, email } = req.body;
        const user = await User.findOneAndUpdate(
            { _id: id },
            { username, email },
            { new: true }
        );
        await user.save();
        res.json(user);
    })

    .delete(async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findOneAndDelete({ id: id });
            await Thought.deleteMany({ username: user.username });
            res.json(user);
        } catch (error) {
            res.json({ message: error.message });
        }
    });

usersRouter
    .route('/:userId/friends/:friendId')
    .post(async (req, res) => {
        const { userId, friendId } = req.params;
        const user = await User.findOne({ id: userId });
        user.friends.push(friendId);
        await user.save();
        res.json(user);
    })
    .delete(async (req, res) => {
        const { userId, friendId } = req.params;
        const user = await User.findOneAndUpdate(
            userId,
            {
                $pull: { friends: friendId },
            },
            {
                new: true,
            }
        );

        res.send(user);
    });

module.exports = usersRouter;
