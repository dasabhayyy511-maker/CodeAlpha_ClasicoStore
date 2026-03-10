const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    sizes: [{ type: String, required: true }],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)
