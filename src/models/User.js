const mongoose = require('mongoose')    

const userSchema = new mongoose.Schema({
    sender_psid : {
        type: String,
        require : true
    },
    firstname : {
        type: String
    },
    dob : {
        type: Date,
    },
    createdAt : {
        type: Date,
    },
    loggedOn : {
        type: Date,
    },
    basicDeatils : {
        type: Boolean,
    },
    
}, {strict: false})

module.exports = mongoose.model('user', userSchema)