const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const userController = require("../controllers/user.controller");
const { isAuth } = require("../utils/auth");

const userRouter = express.Router();

// userRouter.get("/seed", async (req, res) => {
//   await User.deleteMany();
//   const createdUsers = await User.insertMany(data.users);
//   res.send({ createdUsers });
// });

userRouter.post("/register", asyncHandler(userController.signUp));

userRouter.post("/login", asyncHandler(userController.login));

userRouter.put("/profile", isAuth, asyncHandler(userController.updateProfile));

module.exports = userRouter;
