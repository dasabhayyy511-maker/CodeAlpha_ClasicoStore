const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped"],
      default: "Pending"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)
