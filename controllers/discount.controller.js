const Discount = require('../models/discount.model');
const Category = require('../models/categories.model');
const Product = require('../models/products.model');

const aWeek = 7 * 3600 * 24 * 1000; //7days
const scWeek = 7 * 2 * 3600 * 24 * 1000; //7days
const thWeek = 7 * 3 * 3600 * 24 * 1000; //7days
const aMonth = 7 * 4 * 3600 * 24 * 1000; //7days

module.exports.getDiscounts = async (req, res) => {
    try {
        const allDiscounts = await Discount.find()
        return res.json({
            status: "success",
            allDiscounts: allDiscounts
        })
    } catch (error) {
        return res.status(500).json({ msg: "error" })
    }
}
module.exports.createDiscount = async (req, res) => {
    try {
        const { category, discount } = req.body
        // console.log(req.body.category);
        let currentDay = new Date();
        let day = Date.now();
        let deadline;
        const checkDiscount = await Discount.findOne({ category: req.body.category });
        // console.log(checkDiscount, 'checkdiscount');
        if (checkDiscount && checkDiscount.isDelete === false) {
            return req.status(400).json({ msg: "this discount already exists" })
        }
        if (!req.body.date) {
            return req.status(400).json({ msg: "error" })
        }
        if (req.body.date === "a week") {
            deadline = day + aWeek;
        }
        if (req.body.date === "two weeks") {
            deadline = day + scWeek;
        }
        if (req.body.date === "three weeks") {
            deadline = day + thWeek;
        }
        if (req.body.date === "a month") {
            deadline = day + aMonth;
        }
        let products = await Product.find({ category: req.body.category });
        if (!products) {
            return req.status(400).json({ msg: "this category doesn't exists" })
        }
        await products.map(async item => {
            await Product.findByIdAndUpdate({ _id: item._id }, {
                discount: req.body.discount
            })
        })
        let from = currentDay;
        let to = new Date(deadline);
        const newDiscount = new Discount({
            category, discount, from, to
        });
        // console.log(newDiscount);
        await newDiscount.save();
        return res.json({ msg: "created a coupoun", newDiscount });
    } catch (error) {
        return res.status(500).json({ msg: "Cannot create discount" })
    }
}
module.exports.deleteDiscount = async (req, res) => {
    try {
        if (!req.params) {
            return res.status(400).json({ msg: "not find discount" });
        }
        const findDiscount = await Discount.findOne({ _id: req.params.id })
        if (!findDiscount) {
            return res.status(400).json({ msg: "not find discount" });
        }
        const products = await Product.find({ category: findDiscount.category });
        await products.map(async item => {
            await Product.findByIdAndUpdate({ _id: item._id }, {
                discount: 0
            })
        })
        await Discount.findByIdAndUpdate({ _id: req.params.id }, { isDelete: true });
        return res.json({ msg: "Deleted this discount" });
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}