const mongoose = require("mongoose")
const dotenv = require("dotenv")

const Product = require("./models/Product")
const products = require("./data/products")

dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/clasico_store"

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    await Product.deleteMany({})
    await Product.insertMany(products)
    console.log("Products seeded successfully.")
    process.exit(0)
  } catch (error) {
    console.error("Seeding failed:", error.message)
    process.exit(1)
  }
}

seedDatabase()
