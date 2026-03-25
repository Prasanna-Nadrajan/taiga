const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  image: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
