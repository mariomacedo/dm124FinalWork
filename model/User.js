const mongoose = require('mongoose');
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

/**
 * @typedef User
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * @typedef LoginUser
 * @property {string} email.required
 * @property {string} password.required
 */
module.exports = mongoose.model('User', userSchema);
