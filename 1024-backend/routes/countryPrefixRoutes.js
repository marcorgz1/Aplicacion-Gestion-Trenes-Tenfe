const express = require("express");
const prefixRouter = express.Router();

const prefixController = require("../controllers/prefixesController");


prefixRouter.get("/", prefixController.getCountryPrefix);


prefixRouter.post("/", prefixController.addCountryPrefix);

module.exports = prefixRouter;
