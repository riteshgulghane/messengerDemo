const userData = require('../models/UserData')
const userService = require('../services/UserService')

module.exports = {
    addUserData,
    getUserDataById,
    deleteUserData,
    getAllUserData,
    getAllMessages,
    getUserMessages
};


async function addUserData(body) {

    const newEntry = new userData(body);
    newEntry.createdAt = new Date();
    return await newEntry.save();
}


async function getAllUserData() {
    return await userData.find({});
}

async function getUserDataById(id) {
    return await userData.findOne({ _id: id });
}

async function deleteUserData(user_id) {

}

async function getAllMessages() {
    return await userData.find({}, { message: 1, _id: 0 });
}

async function getUserMessages(id) {
    return await userData.find({sender_psid: id}, { message: 1, _id: 0 });
}