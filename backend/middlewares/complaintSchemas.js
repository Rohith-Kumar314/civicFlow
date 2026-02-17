const Joi = require("joi");

exports.raiseComplaintSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
  department: Joi.string()
    .valid("Electrician", "Plumber", "Carpenter", "Technical")
    .required()
    .messages({
      "any.only": "Please select a valid department",
      "string.empty": "Department is required",
    }),
  images: Joi.array().items(Joi.string().uri()).optional(),
});
