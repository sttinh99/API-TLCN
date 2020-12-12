const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true //xoa khoang cach dau cuoi
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: Array,
        default: ""
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('Users', userSchema);