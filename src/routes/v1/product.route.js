const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { productValidation } = require('../../validations');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('Createproduct'), validate(productValidation.createProduct), productController.createProduct)
  .get(auth('getProducts'), validate(productValidation.getProducts), productController.getProducts);

router.post('/image', productController.getPresignedURL);

router
  .route('/:productId')
  .get(auth('getProduct'), validate(productValidation.getProduct), productController.getProduct)
  .patch(auth('updateProduct'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth('deleteProduct'), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
