const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    dimensions: {
        type: String,
        required: true
    },
    stockLeft: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    image: [{
        url: String,
        filename: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Furniture', FurnitureSchema);