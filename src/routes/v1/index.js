const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const labRouter = require('./labs.route');
// const docsRoute = require('./docs.route');
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
router.use('/users', userRoute);
router.use('/product', productRoute);
router.use('/lab', labRouter);

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
