const express = require('express')
const router = express.Router()
const userDataService = require("../services/UserDataService");

router.post('/', addUserData);
router.post('/updateUserData/:id', updateUserData);
router.get('/:id', getUserDataById);
router.get('/', getAllUserData);
router.delete('/:id', deleteUserData);

module.exports = router

function addUserData(req, res, next) {
  userDataService.addUserData(req.body)
  .then(data => data ? res.json(data) : res.json(null))
    .catch(err => next(err));
};

function getUserDataById(req, res, next) {
  userDataService.getUserDataById(req.params.id)
    .then(userData => userData ? res.json(userData) :res.json(null))
    .catch(err => next(err));
};

function getAllUserData(req, res, next) {
  userDataService.getAllUserData(req.params.id)
    .then(userData => userData ? res.json(userData) :res.json(null))
    .catch(err => next(err));
};

function updateUserData(req, res, next) {
  userDataService.updateUserData(req.params.id, req.body)
  .then(data => data ? res.json(data) : res.json(null))
    .catch(err => next(err));
};

function deleteUserData(req, res, next) {
  userDataService.deleteUserData(req.params.id)
  .then(data => data ? res.json(data) : res.json(null))
    .catch(err => next(err));
};



