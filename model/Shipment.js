const mongoose = require('mongoose');


/**
 * @typedef Shipment
 * @property {string} orderId.required
 * @property {string} clientId.required
 * @property {string} receiverName.required
 * @property {string} receiverCpf.required
 * @property {boolean} isReceiverTheBuyer.required
 * @property {string} date
 * @property {Array} coordinates.required
 */
const shipmentSchema = new mongoose.Schema({
    orderId : {
        type: String,
        required: true,
        min: 6, 
        max: 255
    },
    clientId : {
        type: String,
        required: true,
        min: 6, 
        max: 255
    },
    receiverName: {
        type: String,
        required: true,
        min: 6, 
        max: 255
    },
    receiverCpf: {
        type: String,
        require: true,
        min: 11,
        max: 11
    },
    isReceiverTheBuyer: {
        type: Boolean,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    coordinates: {
        type: [Number],
        required: true
    }
    

});

module.exports = mongoose.model('Shipment', shipmentSchema);
