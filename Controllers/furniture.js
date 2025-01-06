const Furniture = require('../Models/Furniture');


class FurnitureController {
    static async allfurniture(req, res, next) {
        try {
            const furniture = await Furniture.find({});
            res.json(furniture);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
    static async furniturebyid(req, res) {
        try {
            const furniture = await Furniture.findById(req.params.id);
            res.json(furniture);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async reviewsoffurniture(req, res) {
        try {
            const furniture = await Furniture.findById(req.params.id).populate('reviews');
            res.json(furniture.reviews);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addReview(req, res) {
        try {
            const furniture = await Furniture.findById(req.params.id);
            furniture.reviews.push(req.body.reviewId);
            await furniture.save();
            res.json({ message: 'Review Added to Furniture' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async updateStockLeft(req, res) {
        try {
            const furnitureIds = req.body.furnitureIds; // array of furniture ids
            const stockLeftRespectively = req.body.stockLeft; // array of stock left
            for (let i = 0; i < furnitureIds.length; i++) {
                const furniture = await Furniture.findById(furnitureIds[i]);
                furniture.stockLeft = stockLeftRespectively[i];
                await furniture.save();
            }
            res.json({ message: 'Stock Left Updated' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //admin routes just writing these don't know when it will come handy agar man kara toh admin ka bhi likh denge
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    static async createfurniture(req, res) {
        try {
            // console.log(req.query);
            if (req.query.admin !== 'true') {
                throw new Error('Unauthorized');
            }
            else if (!req.files) {
                throw new Error('File upload failed');
            }
            else {
                const { name, details, price, dimension, stockLeft, category } = req.body;
                const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
                const furniture = new Furniture({ name, price, details, dimensions: dimension, stockLeft, category, image: images });
                await furniture.save();
                res.status(201).json({ success: true });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async updatefurniture(req, res) {
        try {
            if (req.query.admin !== 'true') {
                throw new Error('Unauthorized');
            }
            else {
                const furniture = await Furniture.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async deletefurniture(req, res) {
        try {
            if (req.query.admin !== 'true') {
                throw new Error('Unauthorized');
            }
            else {
                const furniture = await Furniture.findOneAndDelete({ _id: req.params.id });
                res.json(furniture);
            }
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
}

module.exports = FurnitureController;