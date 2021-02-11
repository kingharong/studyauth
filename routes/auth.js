const express= require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const controller = require('../controller/authController');
const router= express.Router();

router.get('/google', controller.google);
router.get('/google/callback', controller.callback);

module.exports= router;