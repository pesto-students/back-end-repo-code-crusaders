const Joi = require('joi');
const { password } = require('./custom.validation');

const registerDoctor = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    doctor: Joi.object({
      regID: Joi.string().required(),
      hospital: Joi.string().required(),
    }),
    address: Joi.object({
      address1: Joi.string().required(),
      address2: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      pincode: Joi.string().required(),
    }),
  }),
};

const registerLab = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    image: Joi.string().required(),
    lab: Joi.object({
      name: Joi.string().required(),
      regID: Joi.string().required(),
    }),
    address: Joi.object({
      address1: Joi.string().required(),
      address2: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      pincode: Joi.string().required(),
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  registerDoctor,
  registerLab,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
