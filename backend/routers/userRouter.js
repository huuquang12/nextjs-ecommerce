import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken, isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.get("/seed", async (req, res) => {
  await User.deleteMany();
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
});

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      isAdmin: false,
    });

    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser),
    });
  })
);

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
          coordinate: user.coordinate,
        });
        return;

      }
      res.status(401).send({ message: "Password is incorrect" });
    } else {
      res.status(401).send({ message: "Email is incorrect" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password)
      : user.password;
    await user.save();

    const token = generateToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      coordinate: user.coordinate,
    });
  })
);

// update address 
userRouter.put(
  "/update-address",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.coordinate = req.body.address;
    await user.save();
    
    res.send({
      coordinate : user.coordinate
    });
  })
);

export default userRouter;
