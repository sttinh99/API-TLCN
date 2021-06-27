const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user_id: String,
    content: {
        type: String,
        trim: true
    },
    product_id: String,
    reply: Array,
    username: String
}, {
    timestamps: true
})

module.exports = mongoose.model("Comment", commentSchema);
