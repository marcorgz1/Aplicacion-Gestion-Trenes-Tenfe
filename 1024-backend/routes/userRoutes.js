const express = require("express");
const userRouter = express.Router();

const { UsersController } = require("../controllers/userController");

const { verifyToken, isAdmin } = require("../middlewares/auth");

userRouter.get("/", verifyToken, isAdmin, UsersController.get);
userRouter.get("/me", UsersController.getMe);

userRouter.post("/register", UsersController.add);
userRouter.post("/login", UsersController.login);
userRouter.post("/request-reset", UsersController.requestPasswordReset); // Endpoint para solicitar la recuperación de contraseña
userRouter.post("/reset-password", UsersController.executePasswordReset); // Endpoint para cambiar la contraseña usando el token

userRouter.put('/update-password', UsersController.updatePassword)
userRouter.put('/:id', UsersController.updateProfile)

module.exports = userRouter;
