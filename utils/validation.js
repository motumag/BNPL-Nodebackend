const Joi = require("joi");
const paymentServiceSchema = Joi.object({
  serviceName: Joi.string()
    .valid("COOPASS", "CHAPA", "EBIRR", "STRIPE", "PAYPAL")
    .required(),
});
module.exports = { paymentServiceSchema };
