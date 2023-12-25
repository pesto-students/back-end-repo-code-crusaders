const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    details: Joi.object({
      metal: Joi.string(),
      features: Joi.string(),
      specifications: Joi.string(),
      materialComposition: Joi.string(),
    }),
    price: Joi.number().required(),
    mrp: Joi.number().required(),
    expectedDays: Joi.number().required(),
    customFields: Joi.array().items(
      Joi.object({
        name: Joi.string().trim(),
      }),
    ),
    images: Joi.array().items(Joi.string()).max(3).required(), // Maximum 3 images and required
  }),
};

const getProducts = {
  query: Joi.object().keys({
    lab: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      details: Joi.object({
        metal: Joi.string(),
        features: Joi.string(),
        specifications: Joi.string(),
        materialComposition: Joi.string(),
      }),
      price: Joi.number(),
      mrp: Joi.number(),
      expectedDays: Joi.number(),
      customFields: Joi.array().items(
        Joi.object({
          name: Joi.string().trim(),
        }),
      ),
      images: Joi.array().items(Joi.string()).max(3),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
