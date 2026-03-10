# CLASICO Store

CLASICO is a basic e-commerce website built for an internship task using:

- HTML
- CSS
- JavaScript
- Node.js + Express
- MongoDB

## Folder Structure

```text
clasico-store
|-- index.html
|-- shop.html
|-- product.html
|-- cart.html
|-- login.html
|-- server.js
|-- seed.js
|-- package.json
|-- .env.example
|-- css
|   `-- style.css
|-- js
|   `-- script.js
|-- images
|-- models
|-- routes
`-- data
```

## Features

- Product listing
- Product details page
- Add to cart
- Login and register
- Order checkout
- Database storage for products, users, and orders

## Step By Step Setup

1. Open terminal inside the `clasico-store` folder.
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Make sure MongoDB is running on your system
5. Run `npm run seed`
6. Run `npm start`
7. Open `http://localhost:5000`

## MongoDB

If you have MongoDB Compass or local MongoDB installed, use this default connection:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/clasico_store
```

You can also use MongoDB Atlas by replacing the connection string in `.env`.

## Replacing Images

The website currently uses demo SVG clothing artwork inside the `images` folder.

To replace them with your own clothing photos:

1. Add your image files inside `images`
2. Keep the same file names or update the image paths in `data/products.js`
3. If you change hero images, also update the paths in `index.html`

## GitHub Upload

1. Create a new repository named `CodeAlpha_ClasicoStore`
2. Upload the full `clasico-store` folder
3. Push all files to GitHub
4. Add screenshots or a screen recording for LinkedIn/video explanation

## Important Note

If MongoDB is not connected, the frontend still shows demo products using fallback data, but for the internship submission you should run MongoDB so registration and orders are stored properly.
