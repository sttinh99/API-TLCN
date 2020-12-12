const Category = require('../models/categories.model');

module.exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log("jiji");
        res.json({ categories })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
module.exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findOne({ name });
        if (category) return res.status(400).json({ msg: "this category already exists" });
        const newCategory = new Category({ name });
        await newCategory.save();
        return res.json({ msg: "created a category", newCategory });
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}
module.exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        return res.json({ msg: "deleted a category" });
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}
module.exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        await Category.findByIdAndUpdate({ _id: req.params.id }, { name });
        res.json({ msg: "update a category" });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}