const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { getS3Image } = require('../utils/s3');
const { Order, Product, User } = require('../models');

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['limit', 'page', 'sortBy']);
  options.populate = 'product';

  if (req.user.role === 'lab') {
    filter.lab = req.user._id;
  } else if (req.user.role === 'doctor') {
    filter.doctor = req.user._id;
  }

  const orders = await Order.paginate(filter, options);

  orders.results = await Promise.all(
    orders.results.map(async (order) => {
      const orderObj = order.toObject();
      const { product, status } = orderObj;

      if (req.user.role === 'doctor') {
        if (product.images && product.images.length > 0) {
          const signedUrl = await getS3Image(product.images[0], 'product/');

          // Update the images array of the current product with the updatedImages
          product.images[0] = signedUrl;
        }
      }

      if (req.user.role === 'lab') {
        const actions = [];
        if (status.toLowerCase() === 'pending'.toLowerCase()) {
          actions.push(
            {
              label: 'Accept',
              status: 'accepted',
            },
            {
              label: 'Reject',
              status: 'rejected',
            },
          );
        } else if (status.toLowerCase() === 'accepted'.toLowerCase()) {
          actions.push({
            label: 'Ready to Ship',
            status: 'readyToShip',
          });
        } else if (status.toLowerCase() === 'readyToShip'.toLowerCase()) {
          actions.push({
            label: 'Delivery',
            status: 'delivered',
          });
        }

        if (actions.length > 0) {
          orderObj.actions = actions;
        }
      }

      // If the product doesn't have images, return it as is
      return orderObj;
    }),
  );

  res.send(orders);
});

const getOrdersNew = catchAsync(async (req, res) => {
  const filter = {
    doctor: req.user._id,
  };
  const options = pick(req.query, ['limit', 'page', 'sortBy']);
  options.populate = 'product';
  const orders = await Order.paginate(filter, options);

  res.status(httpStatus.OK).res(orders);
});

const createOrder = catchAsync(async (req, res) => {
  const product = await Product.findById(req.body.product);
  if (!product || product.lab.toString() !== req.body.lab.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product or Lab is not valid');
  }

  const user = await User.findById(req.user._id);
  const params = {
    doctor: req.user._id,
    ...req.body,
    address: user.address[user.primaryAddress],
    orderDate: new Date().toISOString(),
    status: 'pending',
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
