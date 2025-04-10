const express = require('express');
const cardRouter = express.Router();

const cardValidateController = require('../controllers/cardController') ;

cardRouter.post("/validate" , cardValidateController)

module.exports = cardRouter