const fallbackProducts = [
  {
    _id: "vintage-denim-jacket",
    name: "Vintage Denim Jacket",
    price: 79,
    category: "Denim Jackets",
    image: "images/denim-jacket.png",
    shortDescription: "Structured washed denim with a timeless oversized fit.",
    description:
      "A signature CLASICO outerwear piece with a vintage wash, clean brass buttons, and a relaxed streetwear silhouette designed for year-round layering.",
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    _id: "retro-graphic-tee",
    name: "Retro Graphic Tee",
    price: 35,
    category: "Vintage Tees",
    image: "images/graphic-tee.png",
    shortDescription: "Soft cotton tee with a faded old-school front print.",
    description:
      "This heavyweight cotton tee pairs a retro graphic with a muted beige palette for a premium everyday look that feels broken in from day one.",
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    _id: "classic-hoodie",
    name: "Classic Hoodie",
    price: 55,
    category: "Retro Hoodies",
    image: "images/hoodie.png",
    shortDescription: "Minimal logo hoodie in a deep cocoa tone.",
    description:
      "Crafted for comfort with brushed fleece lining, dropped shoulders, and subtle CLASICO embroidery that keeps the styling refined and wearable.",
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    _id: "sand-utility-overshirt",
    name: "Sand Utility Overshirt",
    price: 64,
    category: "Accessories",
    image: "images/overshirt.png",
    shortDescription: "Light utility layering piece with vintage pocket details.",
    description:
      "A streetwear overshirt in a warm sand colorway, made for layering over tees and hoodies while keeping the whole fit polished and seasonal.",
    sizes: ["S", "M", "L", "XL"],
    featured: true
  },
  {
    _id: "heritage-cargo-pants",
    name: "Heritage Cargo Pants",
    price: 68,
    category: "Accessories",
    image: "images/cargo-pants.png",
    shortDescription: "Relaxed fit cargos with clean utility pockets.",
    description:
      "Tailored street cargos with a retro-inspired cut, warm neutral tones, and practical pocket placement for a functional everyday outfit.",
    sizes: ["S", "M", "L", "XL"],
    featured: false
  },
  {
    _id: "muted-gold-cap",
    name: "Muted Gold Cap",
    price: 24,
    category: "Accessories",
    image: "images/cap.png",
    shortDescription: "Vintage six-panel cap with stitched CLASICO mark.",
    description:
      "A finishing accessory built with structured cotton twill, an adjustable back strap, and a premium muted-gold tone that ties the collection together.",
    sizes: ["One Size"],
    featured: false
  }
]

const page = document.body.dataset.page

document.addEventListener("DOMContentLoaded", () => {
  initializeMobileMenu()
  updateCartCount()
  updateLoggedInState()
  routePage()
})

function routePage() {
  if (page === "home") renderFeaturedProducts()
  if (page === "shop") renderShopProducts()
  if (page === "product") renderProductDetails()
  if (page === "cart") renderCartPage()
  if (page === "login") initializeAuthPage()
}

function initializeMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const navLinks = document.getElementById("navLinks")

  if (!menuToggle || !navLinks) return

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open")
  })
}

async function fetchProducts() {
  try {
    const response = await fetch("/api/products")
    if (!response.ok) throw new Error("Failed to fetch products")
    return await response.json()
  } catch (error) {
    return fallbackProducts
  }
}

async function fetchProductById(id) {
  try {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) throw new Error("Failed to fetch product")
    return await response.json()
  } catch (error) {
    return fallbackProducts.find((item) => item._id === id || item.slug === id)
  }
}

function productCardTemplate(product) {
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-content">
        <div class="product-meta">
          <div>
            <h3>${product.name}</h3>
            <p>${product.category}</p>
          </div>
          <span class="product-price">$${product.price}</span>
        </div>
        <p class="product-description">${product.shortDescription}</p>
        <div class="product-actions">
          <a href="product.html?id=${product._id || product.slug}" class="btn btn-secondary">Details</a>
          <button class="btn btn-primary" data-add-cart="${product._id || product.slug}">Add to Cart</button>
        </div>
      </div>
    </article>
  `
}

async function renderFeaturedProducts() {
  const container = document.getElementById("featuredProducts")
  if (!container) return

  const products = await fetchProducts()
  const featured = products.filter((product) => product.featured).slice(0, 4)
  container.innerHTML = featured.map(productCardTemplate).join("")
  bindAddToCart(products)
}

async function renderShopProducts() {
  const container = document.getElementById("shopProducts")
  const filterButtons = document.querySelectorAll(".filter-button")
  if (!container) return

  const products = await fetchProducts()

  const render = (category = "All") => {
    const filtered =
      category === "All"
        ? products
        : products.filter((product) => product.category === category)

    container.innerHTML = filtered.map(productCardTemplate).join("")
    bindAddToCart(products)
  }

  render()

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"))
      button.classList.add("active")
      render(button.dataset.category)
    })
  })
}

async function renderProductDetails() {
  const container = document.getElementById("productDetails")
  if (!container) return

  const params = new URLSearchParams(window.location.search)
  const productId = params.get("id")

  if (!productId) {
    container.innerHTML = '<div class="loading-card">No product selected.</div>'
    return
  }

  const product = await fetchProductById(productId)

  if (!product) {
    container.innerHTML = '<div class="loading-card">Product not found.</div>'
    return
  }

  const sizesMarkup = (product.sizes || ["S", "M", "L", "XL"])
    .map(
      (size, index) =>
        `<button class="size-option ${index === 0 ? "active" : ""}" data-size="${size}">${size}</button>`
    )
    .join("")

  container.innerHTML = `
    <div class="product-gallery">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="product-info">
      <p class="eyebrow">${product.category}</p>
      <h1>${product.name}</h1>
      <p class="product-price">$${product.price}</p>
      <p class="product-description">${product.description}</p>
      <div>
        <h3>Select Size</h3>
        <div class="size-options">${sizesMarkup}</div>
      </div>
      <button class="btn btn-primary" id="addSingleProduct">Add to Cart</button>
    </div>
  `

  let selectedSize = (product.sizes && product.sizes[0]) || "M"

  container.querySelectorAll(".size-option").forEach((button) => {
    button.addEventListener("click", () => {
      container.querySelectorAll(".size-option").forEach((item) => item.classList.remove("active"))
      button.classList.add("active")
      selectedSize = button.dataset.size
    })
  })

  document.getElementById("addSingleProduct").addEventListener("click", () => {
    addToCart(product, selectedSize)
  })
}

function bindAddToCart(products) {
  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.addCart
      const product = products.find(
        (item) => (item._id || item.slug) === productId
      )
      addToCart(product, (product.sizes && product.sizes[0]) || "M")
    })
  })
}

function getCart() {
  return JSON.parse(localStorage.getItem("clasico_cart") || "[]")
}

function saveCart(cart) {
  localStorage.setItem("clasico_cart", JSON.stringify(cart))
  updateCartCount()
}

function addToCart(product, size) {
  const cart = getCart()
  const productId = product._id || product.slug
  const existingItem = cart.find(
    (item) => item.productId === productId && item.size === size
  )

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      quantity: 1
    })
  }

  saveCart(cart)
  alert(`${product.name} added to cart.`)
}

function updateCartCount() {
  const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0)
  document.querySelectorAll("#cartCount").forEach((count) => {
    count.textContent = totalItems
  })
}

function renderCartPage() {
  const cartItemsContainer = document.getElementById("cartItems")
  const summaryCount = document.getElementById("summaryCount")
  const summaryTotal = document.getElementById("summaryTotal")
  const checkoutButton = document.getElementById("checkoutButton")
  if (!cartItemsContainer) return

  const paintCart = () => {
    const cart = getCart()

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="loading-card">
          <h3>Your cart is empty.</h3>
          <p class="empty-state">Add products from the shop page to continue.</p>
        </div>
      `
      summaryCount.textContent = "0"
      summaryTotal.textContent = "$0"
      return
    }

    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
          <article class="cart-item">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <h3>${item.name}</h3>
              <p>Size: ${item.size}</p>
              <p>Price: $${item.price}</p>
              <div class="quantity-controls">
                <button data-qty="decrease" data-id="${item.productId}" data-size="${item.size}">-</button>
                <span>${item.quantity}</span>
                <button data-qty="increase" data-id="${item.productId}" data-size="${item.size}">+</button>
              </div>
            </div>
            <div>
              <strong>$${item.price * item.quantity}</strong>
              <button class="remove-button" data-remove="${item.productId}" data-size="${item.size}">
                Remove
              </button>
            </div>
          </article>
        `
      )
      .join("")

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0)
    summaryCount.textContent = String(itemCount)
    summaryTotal.textContent = `$${total}`

    bindCartActions(paintCart)
  }

  paintCart()

  checkoutButton.addEventListener("click", handleCheckout)
}

function bindCartActions(callback) {
  document.querySelectorAll("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => {
      const cart = getCart()
      const item = cart.find(
        (entry) =>
          entry.productId === button.dataset.id && entry.size === button.dataset.size
      )

      if (!item) return

      if (button.dataset.qty === "increase") item.quantity += 1
      if (button.dataset.qty === "decrease") item.quantity -= 1

      saveCart(cart.filter((entry) => entry.quantity > 0))
      callback()
    })
  })

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const cart = getCart().filter(
        (entry) =>
          !(
            entry.productId === button.dataset.remove &&
            entry.size === button.dataset.size
          )
      )
      saveCart(cart)
      callback()
    })
  })
}

function initializeAuthPage() {
  const tabs = document.querySelectorAll(".auth-tab")
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const authMessage = document.getElementById("authMessage")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"))
      tab.classList.add("active")
      const isLogin = tab.dataset.authTab === "login"
      loginForm.classList.toggle("active", isLogin)
      registerForm.classList.toggle("active", !isLogin)
      authMessage.textContent = ""
    })
  })

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const formData = new FormData(loginForm)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      localStorage.setItem("clasico_user", JSON.stringify(data.user))
      authMessage.textContent = data.message
      window.setTimeout(() => {
        window.location.href = "shop.html"
      }, 1000)
    } catch (error) {
      authMessage.textContent = error.message || "Login failed."
    }
  })

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const formData = new FormData(registerForm)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      localStorage.setItem("clasico_user", JSON.stringify(data.user))
      authMessage.textContent = data.message
      registerForm.reset()
    } catch (error) {
      authMessage.textContent = error.message || "Registration failed."
    }
  })
}

function updateLoggedInState() {
  const user = JSON.parse(localStorage.getItem("clasico_user") || "null")
  const loginLinks = Array.from(document.querySelectorAll('a[href="login.html"]'))

  loginLinks.forEach((link) => {
    link.textContent = user ? user.name.split(" ")[0] : "Login"
  })

  document.querySelectorAll(".logout-link").forEach((button) => button.remove())

  if (!user) return

  const navLinks = document.getElementById("navLinks")
  if (!navLinks) return

  const logoutButton = document.createElement("button")
  logoutButton.type = "button"
  logoutButton.className = "logout-link"
  logoutButton.textContent = "Logout"
  logoutButton.addEventListener("click", handleLogout)
  navLinks.appendChild(logoutButton)
}

function handleLogout() {
  localStorage.removeItem("clasico_user")
  window.location.href = "index.html"
}

async function handleCheckout() {
  const cart = getCart()
  const user = JSON.parse(localStorage.getItem("clasico_user") || "null")

  if (cart.length === 0) {
    alert("Your cart is empty.")
    return
  }

  if (!user || !user.email) {
    alert("Please login before checkout.")
    window.location.href = "login.html"
    return
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail: user.email,
        items: cart,
        totalAmount
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message)

    localStorage.removeItem("clasico_cart")
    updateCartCount()
    alert(`Order placed successfully. Order ID: ${data.orderId}`)
    window.location.reload()
  } catch (error) {
    alert(error.message || "Checkout failed.")
  }
}
