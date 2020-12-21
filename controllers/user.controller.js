const User = require('../models/users.model');
const Checkout = require('../models/checkout.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    //console.log(req.body);
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'the email already exists' });
        //console.log(password);
        if (password.length < 5)
            return res.status(400).json({ msg: 'Password it at least 6 character long' });
        //encrypt Password
        const passwordHash = await bcrypt.hash(password, 10);
        //sendgrid
        const newUser = new User({
            name, email, password: passwordHash
        })
        await newUser.save();

        //Then create jwt to auth
        const accesstoken = createAccessToken({ id: newUser._id });
        const refreshtoken = createRefreshToken({ id: newUser._id });

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7day
        })

        res.json({ accesstoken })
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //console.log(req.body, "asdasd");
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "user doesn't exists" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Wrong password!!!" });
        const accesstoken = createAccessToken({ id: user._id });
        const refreshtoken = createRefreshToken({ id: user._id });

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 //7day
        })
        res.json({ accesstoken })
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}
module.exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json({ users })
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}
module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });
        if (!user) return res.status(400).json({ msg: "user doesn't exists" });
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
        res.json({ msg: "Logged out" });
    } catch (error) {
        return res.status(500).json({ msg: error })
    }
}
module.exports.refreshToken = async (req, res) => {
    //console.log(req.cookies);
    const rf_token = req.cookies.refreshtoken;
    try {
        if (!rf_token)
            return res.status(400).json({ msg: "Please login or register" });
        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SCERET, (err, user) => {
            if (err) res.status(400).json({ msg: err })
            const accesstoken = createAccessToken({ id: user.id });
            res.json({ user, accesstoken });
        })
    } catch (error) {
        return res.status(500).json({ msg: error })
    }

}
module.exports.addCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(400).json({ msg: "User does not exists" });
        await User.findOneAndUpdate({ _id: req.user.id }, { cart: req.body.cart })
        return res.status(200).json("Added to cart");
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
module.exports.getAddress = async (req, res) => {
    console.log(req.user);
    const user = await User.findById(req.user.id)
    if (!user) return res.status(400).json({ msg: "User does not exists" });
    const address = await User.findById(req.user.id).select('address')
    console.log(address);
    res.json({ address })
}
module.exports.addAddress = async (req, res) => {
    console.log(req.body, 'body');
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(400).json({ msg: "User does not exists" });
        await User.findOneAndUpdate({ _id: req.user.id }, {
            addresses: [...user.addresses, req.body]
        })
        return res.status(200).json("Add address");
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
module.exports.removeItem = async (req, res) => {
    console.log(req.body, 'body');
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(400).json({ msg: "User does not exists" });
        await User.findOneAndUpdate({ _id: req.user.id }, {
            addresses: req.body.addresses
        })
        return res.status(200).json("Add address");
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
module.exports.history = async (req, res) => {
    try {
        const history = await Checkout.find({ userId: req.user.id })
        res.json(history)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
}
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SCERET, { expiresIn: "11m" });
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SCERET, { expiresIn: "7d" });
}