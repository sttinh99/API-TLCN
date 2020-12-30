const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: true
    },
    brand: {
        type: String,
        require: true
    }, 
    warranty: {
        type: String,
        require: true
    },
    prices: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    content: {
        type:Object,
        required: true
    },
    images: {
        type: Object,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        require: true
    },
    sold: {
        type: Number,
        default: 0
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('Products', productSchema);