const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Admin = require('../models/adminModel');
const { findOne } = require('../models/adminModel');

router.get('/', (req, res) => {
    Admin.find({})
    .exec()
    .then(doc => {
        res.status(201).json({
            message: doc
        });
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    });
});

router.post('/login', (req, res) => {
    Admin.findOne({username: req.body.username})
    .select('_id username email password')
    .exec()
    .then(user => {
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err){
                    return res.status(500).json({
                        message: 'Đăng nhập thất bại'
                    })
                }else{
                    if(result){
                        const payload = {
                            userId: user._id,
                            username: user.username, 
                            iat:  Math.floor(Date.now() / 1000) - 30,
                            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60 * 24),
                        }
                        jwt.sign(payload, 'mysecretkey', (err, token) => {
                            if(err){
                                return res.status(500).JSON({
                                    message: 'Xác thực thất bại'
                                });
                            }else{
                                res.status(200).json({
                                    message: {
                                        token: token
                                    }
                                })
                            }
                        })
                    }else{
                        res.status(500).json({
                            message: 'Mật khẩu không chính xác'
                        });
                    }
                }
            });
        }else{
            res.status(500).json({
                message: 'Username không tồn tại'
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    })
});

router.post('/create', (req, res)=>{
    bcrypt.hash("123456", 10, (err, hash) => {
        if(err){
            return res.status(500).json({
                error: 'Đã có lỗi xảy ra'
            });
        }else{
            const admin = new Admin({
                _id:new mongoose.Types.ObjectId(),
                username: "swings",
                password: hash,
            });
            admin.save()
            .then(doc => {
                res.status(201).json({
                    message: admin
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });     
        }
    })
})

router.put('/reset', async (req,res) => {
    const admin = await Admin.findOne()  
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if(err){
            return res.status(500).json({
                error: 'Đã có lỗi xảy ra'
            });
        }else{
            admin.username = req.body.username
            admin.password = hash
            await admin.save()
            .then(admin => {
                res.status(201).json({
                    message: admin
                })
            })
            .catch(error => {
                res.status(500).json({
                    error: error
                })
            })
        }
    })
})

module.exports = router;