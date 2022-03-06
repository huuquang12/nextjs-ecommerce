
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongo = require("mongodb");
const jwt = require("jsonwebtoken");

const data = require("../data.js");

const User = require("../models/userModel");

router.get('/seed',
    async (req, res) => {
        await User.deleteMany();
        const createdUsers = await User.insertMany(data.users);
        res.send({ createdUsers });
    })

router.post("/register", (req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user) {
                return res.status(500).json({
                    message: "Email đã tồn tại",
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Đã có lỗi xảy ra",
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            //createdAt: new Date().toISOString()
                        });
                        user
                            .save()
                            .then((doc) => {
                                res.status(201).json({
                                    //message: 'Đăng ký thành công'
                                    message: user,
                                });
                            })
                            .catch((er) => {
                                res.status(500).json({
                                    error: er,
                                });
                            });
                    }
                });
            }
        });
});
router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email })
        .select("_id password")
        .exec()
        .then((user) => {
            if (user) {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Login failed",
                        });
                    } else {
                        if (result) {
                            const payload = {
                                userId: user._id,
                                password: user.password,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
                            };
                            jwt.sign(payload, "mysecretkey", (err, token) => {
                                if (err) {
                                    return res.status(500).JSON({
                                        message: "Xác thực thất bại",
                                    });
                                } else {
                                    res.status(200).json({
                                        message: {
                                            user: {
                                                userId: user._id,
                                                password: user.password,
                                                //email: user.email
                                            },
                                            token: token,
                                        },
                                    });
                                }
                            });
                        } else {
                            res.status(500).json({
                                message: "Password incorrect",
                            });
                        }
                    }
                });
            } else {
                res.status(500).json({
                    message: "Email incorrect",
                });
            }
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
});

router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId });
    if (user) {
        user.email = req.body.email;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.name = req.body.name;
        const updateUser = await user.save();
        res.status(201).json({
            message: updateUser,
        });
    } else {
        res.status(404).json({
            message: "Not found",
        });
    }
});
router.get("/", async (req, res, next) => {
    await User.find()
        .then((users) => {
            res.status(201).json({
                message: users,
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
});

router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    await User.findOne({ _id: userId })
        .then((user) => {
            res.status(200).json({
                message: user,
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
            });
        });
});

router.put("/:id/reset", async (req, res) => {
    const resetPasswod = await User.findById(req.params.id);
    if (resetPasswod) {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: "Đã có lỗi xảy ra",
                });
            } else {
                resetPasswod.password = hash;
                await resetPasswod
                    .save()
                    .then((resetPasswod) => {
                        res.status(201).json({
                            message: resetPasswod,
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            error: error,
                        });
                    });
            }
        });
    }
});

module.exports = router;
