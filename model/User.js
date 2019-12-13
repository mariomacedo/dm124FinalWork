const mongoose = require('mongoose');

/**
 * @typedef User
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6, 
        max: 255
    },
    email: {
        type: String, 
        required:true,
        min: 6,
        max: 255
    }, 
    password: {
        type: String, 
        required:true,
        min: 6,
        max: 1024
    }, 
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
