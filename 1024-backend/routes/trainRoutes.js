const express = require("express");
const router = express.Router();

const { TrainController } = require("../controllers/trainController");

router.get("/", TrainController.getForRoute);
router.get("/origins", TrainController.getOrigins);
router.get("/destinations", TrainController.getDestinations);
router.get("/:id", TrainController.getById);

module.exports = router;
