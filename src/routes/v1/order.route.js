const express = require('express');
// const validate = require('../../middlewares/validate');
const orderController = require('../../controllers/order.controller');
// const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  // .get(auth('verify'), userController.getUser)
  .get(orderController.getOrders);

router.route('/:orderId').patch(orderController.changeStatus);

module.exports = router;
