const Payment = require('../models/payment.model')
const User = require('../models/users.model')
const Products = require('../models/products.model')

module.exports.getPayment = async (req, res) => {
    try {
        const payments = await Payment.find()
        res.json(payments)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
module.exports.createPayment = async (req, res) => {
    try {
        console.log(req.body, 'body');
        const user = await User.findById(req.user.id).select('name email')
        if (!user) return res.status(400).json({ msg: "user does not exists" });

        const { cart, paymentID, address } = req.body;

        const { _id, name, email } = user;
        const total = cart.reduce((prev, item) => {
            return prev + item.count * item.prices
        }, 0)
        const newPayment = new Payment({
            userId: _id, name, email, cart, paymentID, address: { ...address }, total: total
        })
        await newPayment.save()
        res.json(newPayment)
    } catch (error) {
        res.status(500).json('loi')
    }
}