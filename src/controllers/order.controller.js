const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { Order, Product } = require('../models');

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

const getOrdersNew = catchAsync(async (req, res) => {
  const filter = {
    doctor: req.user._id,
  };
  const options = pick(req.query, ['limit', 'page', 'sortBy']);
  const orders = await Order.paginate(filter, options).populate('product');

  res.status(httpStatus.OK).res(orders);
});

const createOrder = catchAsync(async (req, res) => {
  const product = await Product.findById(req.body.product);
  if (!product || product.lab.toString() !== req.body.lab.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product or Lab is not valid');
  }
  const params = {
    doctor: req.user._id,
    ...req.body,
  };
  const order = await Order.create(params);

  res.status(httpStatus.CREATED).send(order);
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
  getOrdersNew,
  createOrder,
};
