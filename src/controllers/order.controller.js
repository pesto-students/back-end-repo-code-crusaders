const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Order } = require('../models');
// const { response } = require('../app');

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['limit', 'page']);
  // options.populate = 'product';
  const orders = await Order.find(filter, options);
  // console.log("Orders: "+ orders);

  const responseData = await Promise.all(
    orders.map(async (order) => {
      await order.populate('product');
      const { product } = order;
      // console.log('Order singular: '+ order);
      const currentStatus = order.status;
      const actions = [];
      if (currentStatus === 'Pending') {
        actions.push('Accept');
        actions.push('Reject');
      } else if (currentStatus === 'Accepted') {
        actions.push('Ready To Ship');
      } else if (currentStatus === 'Ready To Ship') {
        actions.push('Delivered');
      }

      return {
        orderDetails: order,
        productDetails: product,
        actionButton: actions,
      };
    }),
  );
  res.send(responseData);
});

const changeStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  // Object.assign(order, body);
  // await order.save();
  res.send(order);
});

module.exports = {
  getOrders,
  changeStatus,
};
