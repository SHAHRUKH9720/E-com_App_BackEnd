const mongoose = require("mongoose");

const privacy_policy_schema = new mongoose.Schema({
    privacy_policy: {
        type: String,
        require: true,
    },

},{timestamps:true})

const Privacy_Policy =   mongoose.model('Privacy_Policy',privacy_policy_schema);
module.exports=Privacy_Policy