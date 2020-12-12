const router = require('express').Router()
const productController = require('../controllers/product.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', productController.getProducts);
router.post('/create', productController.createProduct);
router.post('/update/:id', productController.updateProduct);
router.post('/delete/:id', productController.deleteProduct);

module.exports = router;