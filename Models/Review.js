const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    byWhom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    forWhichFurniture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);