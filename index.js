require('dotenv').config();

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
const port = process.env.PORT || 5050;

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/ecommerce');
mongoose.connection.on('connected', () => {
    console.log('Connected to the database');
});
mongoose.connection.on('error', (error) => {
    console.error('Database connection error:', error);
});

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
        secret: process.env.SESSION_SECURE_KEY,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true,
            secure: true, // Required for production
            sameSite: 'none', // Required for cross-origin
            // domain: '.yourdomain.com' // Update this to match your domain
        },
    })
);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



// API Routes
app.use('/furniture', FurnitureRoutes);
app.use('/user', UserRoutes);
app.use('/review', ReviewRoutes);


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to swift mart api')
});
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


// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});