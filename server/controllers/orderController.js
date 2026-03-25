const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place an order (Customer only)
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity
      });

      totalAmount += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD'
    });

    const populated = await order.populate('customer', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name image price')
      .populate('deliveryAgent', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders containing vendor's products
// @route   GET /api/orders/vendor
exports.getVendorOrders = async (req, res) => {
  try {
    // Find all products by this vendor
    const vendorProducts = await Product.find({ vendor: req.user._id }).select('_id');
    const productIds = vendorProducts.map(p => p._id);

    // Find orders that contain these products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
      .populate('customer', 'name email')
      .populate('items.product', 'name image price')
      .populate('deliveryAgent', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm order (Vendor)
// @route   PUT /api/orders/:id/confirm
exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order already processed' });
    }

    order.status = 'confirmed';
    await order.save();

    const populated = await order.populate([
      { path: 'customer', select: 'name email' },
      { path: 'deliveryAgent', select: 'name phone' }
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign delivery agent (Vendor)
// @route   PUT /api/orders/:id/assign
exports.assignDeliveryAgent = async (req, res) => {
  try {
    const { deliveryAgentId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'pending') {
      return res.status(400).json({ message: 'Please confirm the order first' });
    }

    const User = require('../models/User');
    const agent = await User.findById(deliveryAgentId);
    if (!agent || agent.role !== 'delivery_agent') {
      return res.status(400).json({ message: 'Invalid delivery agent' });
    }

    order.deliveryAgent = deliveryAgentId;
    order.status = 'shipped';
    await order.save();

    const populated = await order.populate([
      { path: 'customer', select: 'name email' },
      { path: 'deliveryAgent', select: 'name phone' }
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order (Customer, only if pending)
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending orders' });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all delivery agents (for vendor to assign)
// @route   GET /api/orders/delivery-agents
exports.getDeliveryAgents = async (req, res) => {
  try {
    const User = require('../models/User');
    const agents = await User.find({ role: 'delivery_agent' }).select('name email phone');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
