const express = require("express")
const bcrypt = require("bcryptjs")

const Product = require("../models/Product")
const User = require("../models/User")
const Order = require("../models/Order")
const seedProducts = require("../data/products")

const router = express.Router()

async function ensureProducts() {
  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(seedProducts)
  }
}

router.get("/products", async (_req, res) => {
  try {
    await ensureProducts()
    const products = await Product.find().sort({ createdAt: 1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({
      message: "Unable to load products from database.",
      fallbackProducts: seedProducts
    })
  }
})

router.get("/products/:id", async (req, res) => {
  try {
    await ensureProducts()
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found." })
    }
    res.json(product)
  } catch (error) {
    const fallbackProduct = seedProducts.find(
      (item) => item.slug === req.params.id || item.name === req.params.id
    )
    if (fallbackProduct) {
      return res.json({ ...fallbackProduct, _id: fallbackProduct.slug })
    }
    res.status(500).json({ message: "Unable to load product details." })
  }
})

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: "Registration successful.",
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: "Unable to register user right now." })
  }
})

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." })
    }

    res.json({
      message: "Login successful.",
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: "Unable to login right now." })
  }
})

router.post("/orders", async (req, res) => {
  try {
    const { customerEmail, items, totalAmount } = req.body

    if (!customerEmail || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order details are incomplete." })
    }

    const order = await Order.create({
      customerEmail,
      items,
      totalAmount
    })

    res.status(201).json({
      message: "Order placed successfully.",
      orderId: order._id
    })
  } catch (error) {
    res.status(500).json({ message: "Unable to save order right now." })
  }
})

module.exports = router
