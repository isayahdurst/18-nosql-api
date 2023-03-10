const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema(
    {
        reactionId: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => timestamp.toLocaleString(),
        },
    },
    {
        toObject: {
            getters: true,
        },
        toJSON: {
            getters: true,
        },
    }
);

const ThoughtSchema = new mongoose.Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => timestamp.toLocaleString(),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [ReactionSchema],
    },
    {
        toObject: {
            getters: true,
        },
        toJSON: {
            getters: true,
        },
    }
);

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

module.exports = mongoose.model('Thought', ThoughtSchema);
