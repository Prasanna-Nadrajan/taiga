const express = require('express');
const router = express.Router();
const { getAssignedOrders, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Delivery agent routes
router.get('/assigned', protect, authorize('delivery_agent'), getAssignedOrders);
router.put('/:id/status', protect, authorize('delivery_agent'), updateDeliveryStatus);

module.exports = router;
