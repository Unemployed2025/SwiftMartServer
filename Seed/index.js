require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Models/User');
const Furniture = require('../Models/Furniture');
const Review = require('../Models/Review');
const imageUrl = "https://random-image-pepebigotes.vercel.app/api/random-image";

const dining = [
    {
        url: "https://res.cloudinary.com/duws1u6mk/image/upload/v1736070499/swift-mart/Dinning/tgni9pyjzadz6srzq0h6.jpg",
        filename: "swift-mart/Dinning/tgni9pyjzadz6srzq0h6"
    },
    {
        url: "https://res.cloudinary.com/duws1u6mk/image/upload/v1736070498/swift-mart/Dinning/bawvxepitgdbimvtxzgd.jpg",
        filename: "swift-mart/Dinning/bawvxepitgdbimvtxzgd"
    }
];
const sofa = [
    {
        url: "https://res.cloudinary.com/duws1u6mk/image/upload/v1736071072/swift-mart/Modern%20Sofa/ua3d9fgvmrfj8mfkx8fm.jpg",
        filename:"swift-mart/Modern Sofa/ua3d9fgvmrfj8mfkx8fm"
    },
    {
        url: "https://res.cloudinary.com/duws1u6mk/image/upload/v1736070497/swift-mart/Modern%20Sofa/ln65nrbtbmwatfkxlurq.jpg",
        filename:"swift-mart/Modern Sofa/ln65nrbtbmwatfkxlurq"
    }
];
const bed = [
    {
        url: "https://res.cloudinary.com/duws1u6mk/image/upload/v1736070494/swift-mart/bed/vbrxxhlykeiuc2bapetp.jpg",
        filename: "swift-mart/bed/vbrxxhlykeiuc2bapetp"
    },
    {
        url: "https://res.cloudinary.com/duws1u6mk/image/upload/v1736070491/swift-mart/bed/ffo6hyiamzxhljpm6pvl.jpg",
        filename: "swift-mart/bed/vbrxxhlykeiuc2bapetp"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // await mongoose.connect('mongodb://0.0.0.0:27017/ecommerce');
        console.log('Database connected');

        // Clear existing data
        await User.deleteMany({});
        await Furniture.deleteMany({});
        await Review.deleteMany({});
        console.log('Existing data cleared');

        // Create Users
        const users = await User.insertMany([
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                password: 'password123',
            },
            {
                name: 'Bob Smith',
                email: 'bob.smith@example.com',
                password: 'securepass456',
            },
            {
                name: 'Charlie Brown',
                email: 'charlie.brown@example.com',
                password: 'mypassword789',
            },
        ]);
        console.log('Users created');

        // Create Furniture
        const furnitures = await Furniture.insertMany([
            {
                name: 'Modern Sofa',
                price: 799.99,
                details: 'A comfortable modern sofa with durable fabric.',
                dimensions: '80x35x30 inches',
                stockLeft: 10,
                category: 'Living Room',
                image: sofa,
            },
            {
                name: 'Dining Table Set',
                price: 499.99,
                details: 'A sleek dining table with four chairs.',
                dimensions: '60x40x30 inches',
                stockLeft: 5,
                category: 'Dining',
                image: dining,
            },
            {
                name: 'Queen Bed Frame',
                price: 599.99,
                details: 'Sturdy queen size bed frame with storage drawers.',
                dimensions: '80x60x50 inches',
                stockLeft: 7,
                category: 'Bedroom',
                image: bed,
            },
        ]);
        console.log('Furnitures created');

        // Create Reviews
        const reviews = await Review.insertMany([
            {
                byWhom: users[0]._id,
                forWhichFurniture: furnitures[0]._id,
                title: 'Very Comfortable',
                body: 'The sofa is extremely comfortable and matches my living room perfectly.',
                rating: 5,
            },
            {
                byWhom: users[1]._id,
                forWhichFurniture: furnitures[1]._id,
                title: 'Good Quality',
                body: 'The dining set is well-built and looks great.',
                rating: 4,
            },
            {
                byWhom: users[2]._id,
                forWhichFurniture: furnitures[2]._id,
                title: 'Sturdy and Spacious',
                body: 'The bed frame is very sturdy and the storage drawers are a great addition.',
                rating: 5,
            },
        ]);
        console.log('Reviews created');

        // Update Users with Reviews and Bought Furnitures
        for (const user of users) {
            user.reviews = reviews.filter(review => review.byWhom.toString() === user._id.toString()).map(review => review._id);
            user.boughtFurnitures = furnitures.map(furniture => furniture._id);
            await user.save();
        }
        console.log('Users updated with reviews and purchased furnitures');

        // Update Furnitures with Reviews
        for (const furniture of furnitures) {
            furniture.reviews = reviews.filter(review => review.forWhichFurniture.toString() === furniture._id.toString()).map(review => review._id);
            await furniture.save();
        }
        console.log('Furnitures updated with reviews');

        mongoose.connection.close();
        console.log('Database seeding completed and connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();