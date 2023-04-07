const jwt = require('jsonwebtoken');
const Admin = require('../model/adminModel');
require('dotenv').config();


const checkAdminAuth = async (req, res, next) => {
    const { token } = req.headers
    if (token) {
        try {
            const adminInfo = jwt.verify(token, process.env.SECRETKEY);
            req.user = await Admin.findById(adminInfo.id).select("-password")
            next()
        } catch (err) {
            next({
                status: 401,
                message: "Your token is expire.please login again"
            })
        }
    }
    else {
        res.status(401).json({
            status: 401,
            message: "unauthorized request"
        })
        next()
    }


}

module.exports = checkAdminAuth