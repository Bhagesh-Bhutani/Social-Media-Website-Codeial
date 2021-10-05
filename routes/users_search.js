const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersSearchController = require('../controllers/users_search_controller');

router.get('/', passport.sign_out_handler, usersSearchController.searchUsers);


module.exports = router;