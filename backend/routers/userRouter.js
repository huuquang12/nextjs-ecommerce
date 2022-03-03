const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongo = require('mongodb');
const jwt = require('jsonwebtoken');


const User = require('../models/userModel');
const user = require('../models/userModel');

router.post('/register', (req, res) => {
    User.findOne({username: req.body.username})
    .exec()
    .then(user => {
        if(user){
            return res.status(500).json({
                message: 'Username đã tồn tại'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: 'Đã có lỗi xảy ra'
                    });
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        address: req.body.address,
                        phone: req.body.phone
                        //createdAt: new Date().toISOString()
                    });
                    user.save()
                    .then(doc => {
                        res.status(201).json({
                            //message: 'Đăng ký thành công'
                            message: user
                        });
                    })
                    .catch(er => {
                        res.status(500).json({
                            error: er
                        });
                    });
                }
            });
        }
    });
});



module.exports = router;