const mongoose = require("mongoose");
const { Schema, model } = mongoose;

/*
  PRODUCT SCHEMA

  This model represents a pharmaceutical product
  that can be sold through field employees.
*/

const productSchema = new Schema(
  {
    // Name of the product (e.g., Paracetamol 500mg)
    product_name: {
      type: String,
      required: true,
      trim: true,
    },

    // Brand name (e.g., Cipla, Sun Pharma)
    brand: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Category of product (tablet, syrup, injection, etc.)
    category: {
      type: String,
    },

    // General selling price (optional, can be used for custom pricing)
    price: {
      type: Number,
      min: 0,
    },

    // Available stock quantity in system
    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Short description of product usage
    description: {
      type: String,
    },

    // Product image URL
    image: {
      type: String,
    },

    /*
      MRP = Maximum Retail Price
      - Printed price on medicine strip/bottle
      - Customer cannot be charged above this
    */
    mrp: {
      type: Number,
      min: 0,
    },

    /*
      PTR = Price To Retailer
      - Price at which stockist sells to chemist
      - Retailer earns (MRP - PTR)
    */
    ptr: {
      type: Number,
      min: 0,
    },

    /*
      PTS = Price To Stockist
      - Price at which company sells to stockist
      - Stockist earns (PTR - PTS)
    */
    pts: {
      type: Number,
      min: 0,
    },

    // Pack size (e.g., 10 tablets, 100ml bottle)
    packSize: {
      type: String,
    },

    // Chemical composition (e.g., Paracetamol 500mg)
    composition: {
      type: String,
    },

    // Whether product is active in system or discontinued
    isActive: {
      type: Boolean,
      default: true,
    },

    /*
      Reference to user who created the product
      (Admin or Manager usually)
    */
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index for faster search by product name
productSchema.index({ product_name: 1 });

productSchema.virtual("retailerMargin").get(function () {
  if (this.mrp && this.ptr) {
    return this.mrp - this.ptr;
  }
});

productSchema.virtual("stockistMargin").get(function () {
  if (this.ptr && this.pts) {
    return this.ptr - this.pts;
  }
});


const Product = model("Product", productSchema);

module.exports = Product;
