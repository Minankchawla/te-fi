const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    dataBalance: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);