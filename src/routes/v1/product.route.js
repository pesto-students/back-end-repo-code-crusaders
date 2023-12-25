const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { productValidation } = require('../../validations');
const productController = require('../../controllers/product.controller');
const { uploadthing } = require('../../middlewares/uploadthing');

const router = express.Router();

router
  .route('/')
  // .get(auth('verify'), userController.getUser)
  .post(auth('Createproduct'), validate(productValidation.createProduct), productController.createUser)
  .get(auth('getUsers'), validate(productValidation.getUsers), productController.getUsers)
  .patch(auth('productImage'), uploadthing);

// router.use('/image', uploadthing);
router.post('/image', productController.getPresignedURL);
// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
