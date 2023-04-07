const joi = require('@hapi/joi');

const AdminSignupSchema = joi.object({
    name:joi.string().required().messages({
        'string.empty': `Name is  required `,
      }),
    email:joi.string().email().lowercase().required().messages({
        'string.empty': `Email is  required `,
      }),
      mobile:joi.string().min(10).max(10).messages({
          'string.min': `Mobile should have 10 digits only`,
          'string.max': `Mobile should have 10 digits only`,
        }),
    password:joi.string().min(4).max(16).required().pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$')).messages({
        'string.empty': `Password is a required `,
        'string.min': `Password should have a minimum length of 6`,
        'string.max': `Password should have a maximum length of 20`,
        "string.pattern.base":"password should contain one upperCase ,lowerCase letter and one numeric digit and  length between 6-20'",
      }),
    role:joi.string(),
    country:joi.string(),
    status:joi.string()
    
})

const AdminSigninSchema = joi.object({
    email:joi.string().email().lowercase().required().messages({
        'string.empty': `Email is  required `,
      }),
    password:joi.string().min(4).max(16).required().pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$')).messages({
        'string.empty': `Password is a required `,
        'string.min': `Password should have a minimum length of 6`,
        'string.max': `Password should have a maximum length of 20`,
        "string.pattern.base":"password should contain one upperCase ,lowerCase letter and one numeric digit and  length between 6-20'",
      })
    
})

const ForgotPasswordSchema = joi.object({
    email:joi.string().email().lowercase().required().messages({
        'string.empty': `Email is  required `,
      }),
})

const ResetAndChangePasswordSchema = joi.object({
    password:joi.string().pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$')).messages({
        'string.empty': `Password is a required `,
        'string.min': `Password should have a minimum length of 6`,
        'string.max': `Password should have a maximum length of 20`,
        "string.pattern.base":"password should contain one upperCase ,lowerCase letter and one numeric digit and  length between 6-20'",
      }),
    confirm_password:joi.ref('password')
    

})

const updateAdminSchema = joi.object({
  name:joi.string().required().messages({
      'string.empty': `Name is  required `,
    }),
    email:joi.string().email().lowercase().required().messages({
      'string.empty': `Email is  required `,
    }),
    mobile:joi.string().min(10).max(10).messages({
        'string.min': `Mobile should have 10 digits only`,
        'string.max': `Mobile should have 10 digits only`,
      }),
  role:joi.string(),
  country:joi.string(),
  status:joi.string()
  
})

const PrivacyPolicySchema = joi.object({
  privacy_policy:joi.string().required()
})


module.exports = {
    AdminSignupSchema,
    AdminSigninSchema,
    ForgotPasswordSchema,
    ResetAndChangePasswordSchema,
    updateAdminSchema,
    PrivacyPolicySchema
}