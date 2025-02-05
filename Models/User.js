const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    listedFurnitures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture'
    }],
    boughtFurnitures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture'
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture'
    }]
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);