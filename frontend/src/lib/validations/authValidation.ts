import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
    }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must have at least 6 characters',
    'any.required': 'Password is required',
  }),
});

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cant be empty',
    }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must have at least 6 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password cant be empty',
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .min(6)
    .required()
    .messages({
      'any.only': 'Confirm password must match password',
    }),
  profile: Joi.object({
    phoneNumber: Joi.string().required().messages({
      'string.empty': 'Phone number cant be empty',
      'any.required': 'Phone number is required',
    }),
    picture: Joi.string().allow(null, ''),
    address: Joi.object({
      street: Joi.string().min(1).required().messages({
        'any.required': 'street is required',
        'string.empty': 'street cant be empty',
        'string.min': 'Street must have at least 1 characters',
      }),
      city: Joi.string().min(1).required().messages({
        'any.required': 'City is required',
        'string.empty': 'City cant be empty',
        'string.min': 'City must have at least 1 characters',
      }),
      state: Joi.string().min(1).required().messages({
        'any.required': 'State is required',
        'string.empty': 'State cant be empty',
        'string.min': 'State must have at least 1 characters',
      }),
      postalCode: Joi.string().min(1).required().messages({
        'any.required': 'postal code is required',
        'string.empty': 'postal code cant be empty',
        'string.min': 'Postal code must have at least 1 characters',
      }),
      country: Joi.string().min(1).required().messages({
        'any.required': 'country is required',
        'string.empty': 'country cant be empty',
        'string.min': 'country  must have at least 1 characters',
      }),
      village: Joi.string().min(1).required().messages({
        'any.required': 'village is required',
        'string.empty': 'village cant be empty',
        'string.min': 'village must have at least 1 characters',
      }),
      subDistrict: Joi.string().min(1).required().messages({
        'any.required': 'sub district is required',
        'string.empty': 'sub district cant be empty',
        'string.min': 'sub district must have at least 1 characters',
      }),
    }),
  }),
});
