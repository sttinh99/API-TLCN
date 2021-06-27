const router = require('express').Router()
const commentController = require('../controllers/comments.controller')

const auth = require('../middleware/auth.middleware');


router.get('/:id', commentController.getComments);
// router.post('/create', auth.auth, auth.authAdmin, discountsController.createDiscount);
// router.delete('/delete/:id', discountsController.deleteDiscount);
// router.delete('/delete/:id', auth.auth, auth.authAdmin, discountsController.deleteDiscount);
// router.post('/update/:id', auth.auth, auth.authAdmin, categoriesController.updateCategory);
// router.delete('/delete/:id', auth.auth, auth.authAdmin, categoriesController.deleteCategory);
module.exports = router;