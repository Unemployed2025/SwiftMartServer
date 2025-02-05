const express = require('express');
const multer = require('multer');
const router = express.Router();
const FurnitureController = require('../Controllers/furniture');
const auth = require('../middleware');

const { storage } = require('../config/cloudinary'); // Import Cloudinary storage   
const upload = multer({ storage }); // Set up Multer with Cloudinary storage


router.get('/all', auth, FurnitureController.allfurniture);
router.get('/:id', auth, FurnitureController.furniturebyid);
router.get('/:id/reviews', auth, FurnitureController.reviewsoffurniture);


router.post('/add', upload.array("images"), auth, FurnitureController.createfurniture);


router.patch('/updatestock', auth, FurnitureController.updateStockLeft);
router.patch('/:id/addreview', auth, FurnitureController.addReview);

module.exports = router;    