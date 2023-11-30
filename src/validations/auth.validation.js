const Joi = require('joi');
const { password } = require('./custom.validation');

const registerDoctor = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    doctorID: Joi.string().required(),
    hospital: Joi.string().required(),
    addressLine1: Joi.string().required(),
    landmark: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    // pincode: Joi.string().regex(`^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$`).required(),
  }),
};

const registerLab = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    labName: Joi.string().required(),
    labID: Joi.string().required(),
    affiliationNo: Joi.string().required(),
    gstNo: Joi.string().required(),
    addressLine1: Joi.string().required(),
    landmark: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    // pincode: Joi.string().regex(`^[1-9]{1}[0-9]{2}\\s{0, 1}[0-9]{3}$`).required(),
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
