const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user_id: String,
    content: {
        type: String,
        trim: true
    },
    product_id: String,
    rating: {
        type: Number,
        default: 0
    },
    reply: Array,
    username: String
}, {
    timestamps: true
})

module.exports = mongoose.model("Comment", commentSchema);
