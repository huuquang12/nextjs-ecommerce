const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
    },
    email: { 
        type: String 
    },
    password: {
         type: String,
         required: true
    }, 
    name: { 
        type: String, 
    },
    phone: { 
        type: String, 
    },
    address: { 
        type: String,  
    },
});

module.exports = mongoose.model('User', userSchema);