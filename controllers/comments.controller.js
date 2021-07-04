const Product = require('../models/products.model');
const User = require('../models/users.model')
const Comment = require('../models/comments.model')


module.exports.getComments = async (req, res) => {
    try {
        const idProduct = req.params.id;
        const features = new APIfeatures(Comment.find({ product_id: idProduct }), req.query).sorting().paginating();
        const getComments = await features.query
        //console.log(getComments);
        return res.status(200).json({ results: getComments, result: getComments.length })
    } catch (error) {
        return res.status(400).json({ msg: error })
    }
}
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    sorting() {
        this.query = this.query.sort('-createdAt');
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}