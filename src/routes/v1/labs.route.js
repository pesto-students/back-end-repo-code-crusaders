const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { labValidatoin } = require('../../validations');
const labController = require('../../controllers/user.controller');

const router = express.Router();

router.route('/').get(auth('getLabs'), validate(labValidatoin.getLabs), labController.getLabs);

module.exports = router;
