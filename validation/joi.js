const joi = require('joi')


const UserSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    school: joi.string().required(),
    avatarNumber: joi.string()
})


const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
})

module.exports = {UserSchema,loginSchema}