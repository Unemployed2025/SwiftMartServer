const express = require('express');
const router = express.Router();
const UserControllers = require('../Controllers/user');
const auth = require('../middleware');

router.get('/', auth, UserControllers.alluser);
router.get('/currentuserid', auth, UserControllers.getCurrentUserId);
router.get('/:id', auth, UserControllers.getUserDetails);
router.get('/:id/getreviews', auth, UserControllers.getReviews);
router.get('/:id/boughtfurniture', auth, UserControllers.getBoughtFurnitures);
router.get('/:id/cart', auth, UserControllers.getCart);


router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.post('/refresh',UserControllers.refresh);
router.post('/logout',UserControllers.logout);

router.patch('/:id/addtocart', auth, UserControllers.addToCart);
router.patch('/:id/addboughtfurniture', auth, UserControllers.addBoughtFurniture);
router.patch('/:id/addreview', auth, UserControllers.addReview);

router.delete('/:id/removefromcart', auth, UserControllers.removeFromCart);
router.delete('/:id/emptycart', auth, UserControllers.emptyCart);

module.exports = router;