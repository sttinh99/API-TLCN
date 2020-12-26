const Checkout = require('../models/checkout.model');
const User = require('../models/users.model');
const Product = require('../models/products.model');

module.exports.getCheckout = async (req, res) => {
    try {
        const feature = new APIfeature(Checkout.find(), req.query).filtering().sorting().paginating();
        const checkouts = await feature.query;
        res.json({
            status: "success",
            result: checkouts.length,
            checkouts: checkouts
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
module.exports.createCheckout = async (req, res) => {
    // console.log(req.body, "body");
    const user = await User.findById(req.user.id).select('name email');
    if (!user) return res.status(400).json({ msg: "user does not exists" });
    const { cart, address, payments } = req.body;
    const { _id, name, email } = user;
    const total = cart.reduce((prev, item) => {
        return prev + item.count * item.prices
    }, 0)
    console.log(cart);
    const newCheckout = new Checkout({
        userId: _id, name, email, cart, address, total: total, payments
    })
    cart.map(async item => {
        const x = await Product.findOne({ _id: item._id });
        await Product.findOneAndUpdate({ _id: item._id }, {
            sold: x.sold + item.count,
            quantity: x.quantity - item.count,
        });
    })
    await newCheckout.save();
    res.json({ newCheckout })
}
module.exports.updateCheckout = async (req, res) => {
    console.log(req.body);
    try {
        await Checkout.findByIdAndUpdate({ _id: req.params.id }, { status: req.body.status });
        res.json({ msg: "update a Checkout" });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}
class APIfeature {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.query
        //console.log({ before: queryObj });//before delete page...use pagination
        const excludeFields = ['page', 'sort', 'limit'];
        excludeFields.forEach(el => delete (queryObj[el]));
        //console.log({ after: queryObj }) //after delete page...
        let queryStr = JSON.stringify(queryObj);
        //console.log({ queryObj, queryStr });
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);
        //gte >=
        //gt >
        //lt < || 
        //lte <=
        //regex = tim kiem
        //console.log({ queryObj, queryStr });
        this.query.find(JSON.parse(queryStr));
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query.sort('-createdAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 8;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}