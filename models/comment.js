const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    text: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment',commentSchema)