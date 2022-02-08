const mongoose = require('mongoose')

const userDataSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true
    },
    sender_psid: {
        type: String,
    }
    
}, { strict: false })

module.exports = mongoose.model('userData', userDataSchema)
