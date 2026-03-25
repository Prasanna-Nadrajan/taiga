const Order = require('../models/Order');

// @desc    Get assigned deliveries
// @route   GET /api/delivery/assigned
exports.getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryAgent: req.user._id })
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery status
// @route   PUT /api/delivery/:id/status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.deliveryAgent || order.deliveryAgent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not assigned to this order' });
    }

    const validTransitions = {
      'shipped': ['out_for_delivery'],
      'out_for_delivery': ['delivered']
    };

    const allowed = validTransitions[order.status];
    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from '${order.status}' to '${status}'` 
      });
    }

    order.status = status;
    await order.save();

    const populated = await order.populate([
      { path: 'customer', select: 'name email phone address' },
      { path: 'items.product', select: 'name image price' }
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
