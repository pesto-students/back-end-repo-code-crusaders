const express = require('express');
const authRoute = require('./auth.route');
const productRoute = require('./product.route');
const labRouter = require('./labs.route');
const orderRoute = require('./order.route');
// const config = require('../../config/config');

const router = express.Router();

// const defaultRoutes = [
//   {
//     path: '/auth',
//     route: authRoute,
//   },
//   {
//     path: '/users',
//     route: userRoute,
//   },
// ];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute,
//   },
// ];

router.use('/auth', authRoute);
router.use('/product', productRoute);
router.use('/lab', labRouter);
router.use('/orders', orderRoute);
// defaultRoutes.forEach((route) => {
//   router.use(route.path, route.route);
// });

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router;
