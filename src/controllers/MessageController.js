const express = require('express')
const router = express.Router()
const userDataService = require("../services/UserDataService");

router.get('/:id', getMessagesById);
router.get('/', getAllMessages);

module.exports = router

function getAllMessages(req, res, next) {
  userDataService.getAllMessages()
  .then(data => data ? res.json(data) : res.json(null))
    .catch(err => next(err));
};

function getMessagesById(req, res, next) {
  userDataService.getUserMessages(req.params.id)
    .then(userData => userData ? res.json(userData) :res.json(null))
    .catch(err => next(err));
};