const express = require('express');
const helpFormRouter = express.Router();

const helpController = require('../controllers/helpFormController');

helpFormRouter.post("/new_help", helpController.createHelpForm)
helpFormRouter.get("/all_help", helpController.getHelpForm)


module.exports = helpFormRouter
