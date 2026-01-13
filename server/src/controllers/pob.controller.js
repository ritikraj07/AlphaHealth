const mongoose = require('mongoose');


const Pob = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    
})