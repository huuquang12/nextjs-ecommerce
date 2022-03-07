
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const generateToken = require("../middleware/authenticate")

const data = require("../data.js");

const User = require("../models/userModel");

router.get('/seed',
    async (req, res) => {
        await User.deleteMany();
        const createdUsers = await User.insertMany(data.users);
        res.send({ createdUsers });
    })

router.post("/register", async (req, res) => {
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
    })
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            });
            return;
        }
        res.status(401).send({ message: 'Invalid email or password' });
    }
})

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
