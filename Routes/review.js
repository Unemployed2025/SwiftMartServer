const express = require('express');
const router = express.Router();
const ReviewController = require('../Controllers/review');
const auth = require('../middleware');

router.get('/all', auth, ReviewController.getReview);
router.get('/exist', auth, ReviewController.reviewExist);
router.post('/create', auth, ReviewController.CreateReview);
module.exports = router;