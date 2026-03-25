const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  confirmOrder,
  assignDeliveryAgent,
  cancelOrder,
  getDeliveryAgents
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Customer routes
router.post('/', protect, authorize('customer'), placeOrder);
router.get('/my', protect, authorize('customer'), getMyOrders);
router.put('/:id/cancel', protect, authorize('customer'), cancelOrder);

// Vendor routes
router.get('/vendor', protect, authorize('vendor'), getVendorOrders);
router.put('/:id/confirm', protect, authorize('vendor'), confirmOrder);
router.put('/:id/assign', protect, authorize('vendor'), assignDeliveryAgent);
router.get('/delivery-agents', protect, authorize('vendor'), getDeliveryAgents);

module.exports = router;
