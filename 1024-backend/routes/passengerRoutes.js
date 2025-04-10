const express = require("express");
const passengerDataRouter = express.Router();

const { PassengerController } = require("../controllers/passengerController");

const { verifyToken } = require("../middlewares/auth");

passengerDataRouter.post("/", verifyToken, PassengerController.addData);
passengerDataRouter.get("/", verifyToken, PassengerController.getData);
passengerDataRouter.get("/:id", verifyToken, PassengerController.getDataById);
passengerDataRouter.get("/dni/:dni", verifyToken, PassengerController.getByDNI);

module.exports = passengerDataRouter;
