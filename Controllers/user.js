const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserControllers {

    /**
     * Authentication Methods
     */

    // Register a new user
    static async register(req, res) {
        try {
            const { email, name, password } = req.body;
            const hashed = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashed });

            // Generate tokens
            const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            // Set refresh token as an HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.cookie('userId', newUser._id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json({ message: 'User Created', accessToken });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Login an existing user
    static async login(req, res) {
        try {
            const { name, password } = req.body;
            const user = await User.findOne({ name });
            if (!user) return res.status(400).json({ message: 'Username or Password is incorrect' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: 'Username or Password is incorrect' });

            // Generate tokens
            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            // Set refresh token as an HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.cookie('userId', user._id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({ message: 'Logged in', accessToken });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Refresh the access token
    static async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(403).json({ message: 'Refresh token not provided' });

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Invalid refresh token' });

                const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                res.json({ accessToken: newAccessToken });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Logout the user
    static logout(req, res) {
        res.clearCookie('refreshToken');
        res.clearCookie('userId');
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    }

    /**
     * User Management Methods
     */

    // Fetch all users
    static async alluser(req, res) {
        try {
            const user = await User.find({});
            res.json({ message: 'Giving User Details', details: user });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Fetch specific user details
    static async getUserDetails(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            res.json({ message: 'Giving User Details', details: user });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * User Furniture Management Methods
     */

    // Fetch furniture bought by a user
    static async getBoughtFurnitures(req, res) {
        try {
            const user = await User.findById(req.params.id).populate('boughtFurnitures');
            res.json({ message: 'Giving User Bought Furniture', details: user.boughtFurnitures });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Add furniture to user's bought list
    static async addBoughtFurniture(req, res) {
        try {
            const user = await User.findById(req.params.id);
            user.boughtFurnitures.push(...req.body.furnitureId);
            await user.save();
            res.json({ message: 'Furnitures Added to User' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * User Reviews Management Methods
     */

    // Add a review to the user
    static async addReview(req, res) {
        try {
            const user = await User.findById(req.params.id);
            user.reviews.push(req.body.reviewId);
            await user.save();
            res.json({ message: 'Review Added to User' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Fetch reviews of the user
    static async getReviews(req, res) {
        try {
            const user = await User.findById(req.params.id).populate('reviews');
            res.json({ message: 'Giving User Reviews', details: user.reviews });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * Cart Management Methods
     */

    // Fetch the user's cart
    static async getCart(req, res) {
        try {
            const user = await User.findById(req.params.id).populate('cart');
            res.json({ message: 'Giving User Cart', details: user.cart });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // Empty the user's cart
    static async emptyCart(req, res) {
        try {
            const user = await User.findById(req.params.id);
            user.cart = [];
            await user.save();
            res.json({ message: 'Cart Emptied' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Add an item to the user's cart
    static async addToCart(req, res) {
        try {
            const user = await User.findById(req.params.id);
            user.cart.push(req.body.furnitureId);
            await user.save();
            res.json({ message: 'Furniture Added to Cart' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Remove an item from the user's cart
    static async removeFromCart(req, res) {
        try {
            const user = await User.findById(req.params.id);
            const index = user.cart.indexOf(req.body.furnitureId);
            user.cart.splice(index, 1);
            await user.save();
            res.json({ message: 'Furniture Removed from Cart' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Utility Methods
     */

    // Fetch the current user's ID from cookies
    static async getCurrentUserId(req, res) {
        try {
            const id = req.cookies.userId;
            res.json({ message: 'Giving User Id', id });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = UserControllers;
