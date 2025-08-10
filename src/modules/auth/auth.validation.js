import Joi from "joi";

export const registerVal = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .messages({
      "string.pattern.base": `"password" must contain uppercase, lowercase, number, and be at least 8 characters.`,
    }),
  passwordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Password confirmation does not match password",
    }),
});

export const loginVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgetPassVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().allow(""),
});

export const resetPassVal = Joi.object({
  otp: Joi.string().required(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, and be at least 8 characters.",
    }),
  passwordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Password confirmation does not match password",
    }),
});
