const express = require('express');
const { signup, signin, forgotPassword, resetPasswod, profile, adminListing, logout, updateAdmin, changePassword, updatePrivacyPolicy, block_unblock, block_unblock_status } = require('../controller/adminController');
const checkAdminAuth = require('../middleWare/authMiddleware');
const app = express();
const adminRouter = express.Router();

//public route
adminRouter.post('/signup',signup);
adminRouter.post('/signin',signin);
adminRouter.post('/forgotPassword',forgotPassword);
adminRouter.post('/resetPassword/:token',resetPasswod)

//private route
adminRouter.get('/logout',checkAdminAuth,logout)
adminRouter.get('/profile',checkAdminAuth,profile)
adminRouter.get('/admin_listing',checkAdminAuth,adminListing)
adminRouter.post('/update_profile/:_id',checkAdminAuth,updateAdmin)
adminRouter.post('/change_password/:_id',checkAdminAuth,changePassword)
adminRouter.post('/block_unblock/:_id/:status',checkAdminAuth,block_unblock_status)
adminRouter.post('/privacy_policy/',checkAdminAuth,updatePrivacyPolicy)

module.exports = adminRouter