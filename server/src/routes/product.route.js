const express = require("express");
const router = express.Router();

const { verifyToken } = require("../validators/auth.validator");
const {
  createProduct,
  getProducts,
} = require("../controllers/product.controller");

// Create Product
router.post("/", verifyToken, createProduct);

// Get Products
router.get("/", verifyToken, getProducts);

module.exports = router;
