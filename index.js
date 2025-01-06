if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sgMail = require('@sendgrid/mail');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const FurnitureRoutes = require('./Routes/furniture');
const UserRoutes = require('./Routes/user');
const ReviewRoutes = require('./Routes/review');

const app = express();
const port = process.env.PORT;

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/ecommerce');
mongoose.connection.on('connected', () => {
    console.log('Connected to the database');
});
mongoose.connection.on('error', (error) => {
    console.error('Database connection error:', error);
});
const secret = 'hi'
// Middleware Configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(
    session({
        name: 'session',
        secret: process.env.SESSION_SECURE_KEY,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            touchAfter: 24 * 60 * 60,
            crypto: {
                secret
            }
        }),
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        },
    })
);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialize Cart Middleware
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to swift mart api')
})

app.post('/send-newsletter', async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        const msg = {
            to: email,
            from: process.env.SWIFT_MART_EMAIL,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`,
        };

        await sgMail.send(msg);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send email', error: error.message });
    }
});

// Cart Routes
app.post('/cart', (req, res) => {
    const { productid } = req.body;
    req.session.cart.push(productid);
    res.status(200).json({ cart: req.session.cart });
});

app.get('/cart', (req, res) => {
    res.status(200).json({ cart: req.session.cart });
});

app.delete('/cart', (req, res) => {
    const { productid } = req.body;
    if (!productid) {
        return res.status(400).json({ error: 'Product ID is required' });
    }
    req.session.cart = req.session.cart.filter(item => item !== productid);
    req.session.save((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save session' });
        }
        res.status(200).json({ cart: req.session.cart });
    });
});

app.delete('/cart/empty', (req, res) => {
    req.session.cart = [];
    req.session.save((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save session' });
        }
        res.status(200).json({ cart: req.session.cart });
    });
});

// API Routes
app.use('/furniture', FurnitureRoutes);
app.use('/user', UserRoutes);
app.use('/review', ReviewRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
