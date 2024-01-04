const express = require('express');
const validate = require('../../middlewares/validate');
const orderValidator = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth('createOrder'), validate(orderValidator.createOrder), orderController.createOrder)
  .get(auth('getOrders'), validate(orderValidator.getOrders), orderController.getOrders);

router
  .route('/:orderId')
  .patch(auth('changeOrderStatus'), validate(orderValidator.updateStatus), orderController.changeStatus);

module.exports = router;
