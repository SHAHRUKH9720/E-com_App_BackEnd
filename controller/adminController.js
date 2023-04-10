const creatError = require('http-errors');
const bcrypt = require('bcrypt');
const Admin = require('../model/adminModel');
const { AdminSignupSchema ,AdminSigninSchema,ForgotPasswordSchema, ResetAndChangePasswordSchema, updateAdminSchema, PrivacyPolicySchema} = require('../helper/validator_Schema');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const nodemailer = require('nodemailer');
const joi = require('@hapi/joi');
const Privacy_Policy = require('../model/privacy_policyModel');


 
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "sk8806004@gmail.com", // generated ethereal user
      pass: "qnifubrsnrbhrelf", // generated ethereal password
    },
  });

//public route

const signup = async(req,res,next)=>{
    try{
        const result = await AdminSignupSchema.validateAsync(req.body) ;
        const existingUser = await Admin.findOne({"email":result.email});
        if(existingUser) throw creatError.Conflict(`user is already ragisterd with  ${result.email}`);
        const hashPasswod = await bcrypt.hash(result.password,10)
        let admin = {
            email:result.email,
            password:hashPasswod,
            name:req.body.name || 'NA',
            mobile:req.body.mobile || 'NA',
            role:req.body.role ||'NA',
            country:req.body.country || 'NA',
            status:req.body.status || "true"
        }
       let ADMIN =  await Admin.create(admin);
        res.status(200).json({
            code:200,
            message:"Ragistration Successful",
            ADMIN
        })
    }catch(err){
        if(err.isJoi==true) err.status = 400 
        next(err)
    }
}

const signin = async(req,res,next)=>{
    try{
        const result = await AdminSigninSchema.validateAsync(req.body) ;
        const existingUser = await Admin.findOne({email:result.email});
        if(!existingUser)  throw creatError.BadRequest(`invalid credential`);
        let matchPassword = await bcrypt.compare(req.body.password,existingUser.password)
        if(!matchPassword) throw creatError.BadRequest('invalid password')
        const token= jwt.sign({id:existingUser._id},process.env.SECRETKEY,{expiresIn:'1h'});
        res.status(200).json({
            code:200,
            message:"login successfully",
            token
        })
    }catch(err){
        if(err.isJoi==true) err.status = 400    
        next(err)
    }
}

const forgotPassword = async(req,res,next)=>{
    try{
        const result = await ForgotPasswordSchema.validateAsync(req.body) ;
        const existingUser = await Admin.findOne({email:result.email});
        if(!existingUser) throw creatError.NotFound(`invalid credential`);
        const token= jwt.sign({id:existingUser._id},process.env.SECRETKEY,{expiresIn:'15m'});
        var mailOptions = {
            from: 'sk8806004@gmail.com',
            to:existingUser.email ,
            subject: 'Sending Email for forgot Password',
            html: `<a href="http://localhost:4200/account/reset-password/${token}">click</a> to reset password, this link will expire in 15 min`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
                res.status(200).json({
                    code:200,
                    message:'link sent ,please check you mail ,'
                })
            }
          });
    }catch(err){
        if(err.isJoi==true) err.status = 400  
        next(err)
    }
}

const resetPasswod = async(req,res,next)=>{
    try{
        const {token}= req.params;
        const result = await ResetAndChangePasswordSchema.validateAsync(req.body) ;
        const jwtResult = jwt.verify(token, `${process.env.SECRETKEY}`);
        const hashPasswod = await bcrypt.hash(result.password,10)
        await Admin.findByIdAndUpdate(jwtResult.id,{$set:{password:hashPasswod}})
        res.status(200).json({
            code:200,
            message:"password updated successfully"
        })

    }catch(err){
        next(err)
    }
}


const logout = async(req,res,next)=>{
    try{
        res.status(200).json({
            code:200,
            message:'logout successfully',
        })
    }catch(err){
        next(err)
    }
}

const profile = async(req,res,next)=>{
    try{
        let adminProfie = req.user
        res.status(200).json({
            code:200,
            message:'success',
            adminProfie
        })
    }catch(err){
        next(err)
    }
}

const adminListing = async(req,res,next)=>{
    try{
        let limitValue = Number(req.query.limit) ||10;
        let pageNumber = Number(req.query.page)|| 1;
        let skipValue = (pageNumber-1)*limitValue
        let data
        if(req.query.name){
             data = await Admin.find({
                "$or":[
                    {"name":{$regex:req.query.name,$options: "i"}}
                ]
            }).skip(skipValue).limit(limitValue)
        }
        else if(req.query.email){
             data = await Admin.find({
                "$or":[
                    {"email":{$regex:req.query.email,$options: "i"}}
                ]
            }).skip(skipValue).limit(limitValue)
        }
        else if(req.query.email && req.query.email){
             data = await Admin.find({
                "$or":[
                    {"name":{$regex:req.query.name,$options: "i"}},
                    {"email":{$regex:req.query.email,$options: "i"}}
                ]
            }).skip(skipValue).limit(limitValue)
        }
        else {
            data = await Admin.find().skip(skipValue).limit(limitValue)
       }
        res.status(200).json({
            code:200,
            message:'success',
            "data":{
                limit:limitValue,
                page:pageNumber,
                totalCount:data.length,
                result:data
            }
        })
    }catch(err){

    }
}

const updateAdmin = async(req,res,next)=>{
    try{
        const result = await updateAdminSchema.validateAsync(req.body) ;
        const {_id} = req.params
        const update_admin = await Admin.findByIdAndUpdate({_id},{$set:{
            name:req.body.name,
            email:req.body.email,
            role:req.body.role,
            mobile:req.body.mobile,
            country:req.body.country
        }},{
            new:true,
            useFindAndModify:false
        });
        res.status(200).json({
            code:200,
            message:"profile updated Successfully",
            update_admin
        })
    }catch(err){
        if(err.isJoi==true) err.status = 400 
        next(err)
    }
}

const changePassword = async(req,res,next)=>{
    try{
        const result = await ResetAndChangePasswordSchema.validateAsync(req.body) ;
        const {_id}= req.params;
        const hashPasswod = await bcrypt.hash(result.password,10)
        await Admin.findByIdAndUpdate({_id},{$set:{password:hashPasswod}})
        res.status(200).json({
            code:200,
            message:"password updated successfully"
        })

    }catch(err){
        next(err)
    }
}

const updatePrivacyPolicy = async(req,res,next)=>{
    try{
        const result = await PrivacyPolicySchema.validateAsync(req.body) ;
        const privacy_policy = await Privacy_Policy.create({
            privacy_policy:req.body.privacy_policy
        })
        res.status(200).json({
            code:200,
            message:"password updated successfully",
            privacy_policy
        })

    }catch(err){
        next(err)
    }
}



module.exports= {
    signup,signin,forgotPassword,
    resetPasswod,logout,profile,
    adminListing,updateAdmin,
    changePassword,updatePrivacyPolicy
}