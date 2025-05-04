const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["credit_card", "paypal", "stripe"],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  trackingNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
