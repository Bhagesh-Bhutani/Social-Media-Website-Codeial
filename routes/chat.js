const express = require('express');
const passport = require('passport');
const router = express.Router();

const chatController = require('../controllers/chat_controller');

router.get('/', passport.sign_out_handler, chatController.getChatPage);

router.get('/get-contacts', passport.sign_out_handler, chatController.getContacts);

router.get('/fetch-user', passport.sign_out_handler, chatController.fetchUser);

router.post('/create-message', passport.sign_out_handler, chatController.createMessage);


module.exports = router;