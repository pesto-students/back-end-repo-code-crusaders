/* eslint-disable import/no-unresolved */
const { createUploadthing } = require('uploadthing/server');
const { createUploadthingExpressHandler } = require('uploadthing/express');
// const httpStatus = require('http-status');
// const ApiError = require('../utils/ApiError');

const f = createUploadthing({
  errorFormatter: (err) => {
    // console.log('Error uploading file', err.message);
    // console.log('  - Above error caused by:', err.cause);

    return { message: err.message };
  },
});

const uploadRouter = {
  productImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    // eslint-disable-next-line no-console
    // console.log('upload completed', data);
    console.log('data', data);
  }),
};

const uploadthing = () => {
  // const uploadRouter = {
  //   productImage: f({
  //     image: {
  //       maxFileSize: '4MB',
  //       maxFileCount: 4,
  //     },
  //   }).onUploadComplete((data) => {
  //     // eslint-disable-next-line no-console
  //     // console.log('upload completed', data);
  //     req.image = data;
  //     next();
  //   }),
  // };

  // try {
  return createUploadthingExpressHandler({
    router: uploadRouter,
  });
  // } catch (error) {
  //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'error in image upload');
  // }
};

module.exports = {
  uploadthing,
  uploadRouter,
};
