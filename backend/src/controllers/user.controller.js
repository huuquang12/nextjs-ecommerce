const { BadRequestError, AuthFailureError } = require("../core/error.response");
const userModel = require("../models/user.model");
const { generateToken } = require("../utils/auth");
const bcrypt = require("bcrypt");

class UserController {
  updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    const updateUser = await userModel.findById(req.user._id);
    updateUser.name = name;
    updateUser.email = email;
    updateUser.password = password
      ? await bcrypt.hash(req.body.password, 10)
      : updateUser.password;
    await updateUser.save();

    const token = generateToken(updateUser);
    res.send({
      token,
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;
    const foundUser = await userModel.findOne({ email });
    if (!foundUser) {
      throw new BadRequestError("User not registered");
    }
    const match = await bcrypt.compareSync(password, foundUser.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }
    return res.send({
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
      token: generateToken(foundUser),
    });
  };

  signUp = async (req, res, next) => {
    const { name, email, password } = req.body;
    const foundUser = await userModel.findOne({ email });
    if (foundUser) {
      throw new BadRequestError("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      isAdmin: false,
    });

    res.send({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser),
    });
  };
}

module.exports = new UserController();
