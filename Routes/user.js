const express = require('express');
const router = express.Router();
const UserControllers = require('../Controllers/user');
const auth = require('../middleware');

router.get('/', auth, UserControllers.alluser);
router.get('/currentuserid', auth, UserControllers.getCurrentUserId);
router.get('/:id', auth, UserControllers.getUserDetails);
router.get('/:id/getreviews', auth, UserControllers.getReviews);
router.get('/:id/boughtfurniture', auth, UserControllers.getBoughtFurnitures);

router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.post('/refresh',UserControllers.refresh);
router.post('/logout',UserControllers.logout);

router.patch('/:id/addboughtfurniture', auth, UserControllers.addBoughtFurniture);
router.patch('/:id/addreview', auth, UserControllers.addReview);

module.exports = router;