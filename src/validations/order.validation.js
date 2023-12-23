const Joi = require('joi');
// const { objectId } = require('./custom.validation');

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('orders', 'acepted'),
    sortBy: Joi.string().allow(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  getOrders,
};
