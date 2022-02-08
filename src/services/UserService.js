// const express = require('express')
const Users = require('../models/User')

module.exports = {
    getUsers,
    addUser,
    updateUser,
    getUserById,
    checkUser
};

async function getUsers() {
    return await Users.find({}, { _id: 0, firstname: 1, dob: 1, sender_psid: 1 });
}

async function addUser(body) {
    let user = await Users.findOne({ sender_psid: body.sender_psid });
    if (user) {
        return await Users.findByIdAndUpdate(user._id, {
            $set: {
                loggedOn: new Date()
            }
        });;
    }

    body.createdAt = new Date();
    body.loggedOn = new Date();

    body.basicDeatils = false;
    const newUser = new Users(body);
    return await newUser.save();
}

async function updateUser(id, body) {
    return await Users.findOneAndUpdate({ sender_psid: id }, body);
}

async function getUserById(id) {
    return await Users.find({ sender_psid: id });
}

async function checkUser(id) {
    return await Users.findOne({ sender_psid: id });
}