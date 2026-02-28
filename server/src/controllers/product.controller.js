const Product = require("../models/product.model");

// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
      const { product_name } = req.body;
      const userId = req.userId;

    if (!product_name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const newProduct = await Product.create({
      ...req.body,
      createdBy: userId, // assuming verifyToken sets req.user
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search) {
      filter.product_name = {
        $regex: search,
        $options: "i",
      };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
};
