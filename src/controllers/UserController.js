const express = require('express')
const router = express.Router()
const userService = require("../services/UserService");

router.post('/', addUser);
router.post('/:id', updateUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router

function addUser(req, res, next) {
  userService.addUser(req.body)
  .then(data => data ? res.json(data) : res.json(null))
    .catch(err => next(err));
};

function getUserById(req, res, next) {
  userService.getUserById(req.params.id)
    .then(userData => userData ? res.json(userData) :res.json(null))
    .catch(err => next(err));
};

function getAllUsers(req, res, next) {
  userService.getUsers()
    .then(userData => userData ? res.json(userData) :res.json(null))
    .catch(err => next(err));
};

function updateUser(req, res, next) {
  userService.updateUser(req.params.id, req.body)
  .then(data => data ? res.json(data) : res.json(null))
    .catch(err => next(err));
};

function deleteUser(req, res, next) {
  userService.deleteUser(req.params.id)
  .then(data => data ? res.json(data) : res.json(null))
    .catch(err => next(err));
};



