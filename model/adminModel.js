const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        lowercase:true,
        unique:true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: false
    },
    mobile: {
        type: String,
        require: false
    },
    country: {
        type: String,
        require: false
    },
    status: {
        type: String,
        require: false
    },

},{timestamps:true})

const Admin =   mongoose.model('Admin',adminSchema);
module.exports=Admin