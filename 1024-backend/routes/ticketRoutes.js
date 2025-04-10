const express = require("express");
const router = express.Router();

const { TicketController } = require("../controllers/ticketController");

const { verifyToken } = require("../middlewares/auth");

// router.get("/", verifyToken, TicketController.getForUser);
router.get("/", verifyToken, TicketController.getById);
router.post("/", verifyToken, TicketController.add);

module.exports = router;
