const creatError = require('http-errors');
const bcrypt = require('bcrypt');
const Admin = require('../model/adminModel');
const { AdminLoginRagisterSchema ,ForgotPasswordSchema, ResetPasswordSchema} = require('../helper/validator_Schema');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const nodemailer = require('nodemailer');


 
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
        const result = await AdminLoginRagisterSchema.validateAsync(req.body) ;
        const existingUser = await Admin.findOne({"email":result.email});
        if(existingUser) throw creatError.Conflict(`user is already ragisterd with  ${result.email}`);
        const hashPasswod = await bcrypt.hash(result.password,10)
        await Admin.create({
            email:result.email,
            password:hashPasswod,
            name:req.body.name || 'NA',
            mobile:req.body.mobile || 'NA',
            role:req.body.role ||'NA',
            country:req.body.country || 'NA'
        })
        res.status(200).json({
            code:200,
            message:"Ragistration Successful",
        })
    }catch(err){
        next(err)
    }
}

const signin = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const result = await AdminLoginRagisterSchema.validateAsync(req.body) ;
        const existingUser = await Admin.findOne({email:result.email});
        if(!existingUser) throw creatError.NotFound(`invalid credential`);
        let matchPassword = await bcrypt.compare(password,existingUser.password)
        if(!matchPassword) throw creatError.NotFound('invalid password')
        const token= jwt.sign({id:existingUser._id},process.env.SECRETKEY,{expiresIn:'1h'});
        console.log(token)
        res.status(200).json({
            code:200,
            message:"login successfully",
            token
        })
    }catch(err){
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
        next(err)
    }
}

const resetPasswod = async(req,res,next)=>{
    try{
        const {token}= req.params;
        const result = await ResetPasswordSchema.validateAsync(req.body) ;
        const hashPasswod = await bcrypt.hash(result.password,10)
        const jwtResult = jwt.verify(token, `${process.env.SECRETKEY}`);
        await Admin.findByIdAndUpdate(jwtResult.id,{$set:{password:hashPasswod}})
        res.status(200).json({
            code:200,
            message:"password updated successfully"
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

    }
}
module.exports= {signup,signin,forgotPassword,resetPasswod,profile}