const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'accepted', 'readyToShip', 'outForDelivery', 'delivered', 'rejected'),
    sortBy: Joi.string().allow(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createOrder = {
  body: Joi.object().keys({
    lab: Joi.string().custom(objectId),
    product: Joi.string().custom(objectId),
    notes: Joi.string(),
  }),
};

const updateStatus = {
  body: Joi.object().keys({
    status: Joi.string().valid('pending', 'accepted', 'readyToShip', 'outForDelivery', 'delivered', 'rejected'),
  }),
};

module.exports = {
  getOrders,
  createOrder,
  updateStatus,
};
