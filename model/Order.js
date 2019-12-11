const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    clientId : {
        type: String,
        required: true,
        min: 6, 
        max: 255
    },
    date: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        min: 0
    }
});

module.exports = mongoose.model('Order', orderSchema);
