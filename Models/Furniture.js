const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    details: {
        type: String,
        required: true,
        trim: true
    },
    dimensions: {
        type: String,
        required: true
    },
    stockLeft: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    image: [{
        url: String,
        filename: String
    }],
    stockAdded: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Furniture', FurnitureSchema);