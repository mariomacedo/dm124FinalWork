const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
}

// Login Validation
const loginValidation = (data) => {
    const schema =  Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(data);
}

const shipmentValidation = (data) => {
    const schema = Joi.object({
        orderId: Joi.string().min(6).required(),
        clientId: Joi.string().min(6).required(),
        receiverName: Joi.string().min(6).required(),
        receiverCpf: Joi.number().min(11).max(11).required(),
        isReceiverTheBuyer: Joi.bollean().required(),
        coordinates: Joi.array().items(Joi.number()),
    });

    return schema.validate(data);
}

const orderValidation = (data) => {
    const schema = Joi.schema({
        clientId : Joi.string().min(6).required(),
        total: Joi.number().min(0).required()
    });
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
