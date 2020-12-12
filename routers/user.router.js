const router = require('express').Router()
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/infor', auth.auth, userController.getUser);
router.get('/logout', userController.logout);
router.get('/refresh_token', userController.refreshToken);
router.post('/addcart', auth.auth, userController.addCart)
router.get('/history', auth.auth, userController.history);

module.exports = router;