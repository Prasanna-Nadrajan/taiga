const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Public routes
router.get('/', getProducts);
router.get('/vendor/me', protect, authorize('vendor'), getVendorProducts);
router.get('/:id', getProduct);

// Vendor-only routes
router.post('/', protect, authorize('vendor'), createProduct);
router.put('/:id', protect, authorize('vendor'), updateProduct);
router.delete('/:id', protect, authorize('vendor'), deleteProduct);

module.exports = router;
