const Review = require('../Models/Review');

class ReviewController {
    static async CreateReview(req, res) {
        try {
            const { byWhom, forWhichFurniture, title, body, rating } = req.body;
            const newReview = await Review.create({ byWhom, forWhichFurniture, title, body, rating });
            res.status(201).json({ message: 'Review Created', review: newReview._id });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async getReview(req, res) {
        try {
            const review = await Review.find({});
            res.json({ message: 'Giving Review Details', details: review });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async reviewExist(req, res) {
        try {
            const { userid, furnitureid } = req.query;
            // console.log(userid, furnitureid);
            const review = await Review.findOne({ byWhom: userid, forWhichFurniture: furnitureid });
            if (review) {
                res.json({ message: 'true' });
            } else {
                res.json({ message: 'false' });
            }
        } catch(err){
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = ReviewController;