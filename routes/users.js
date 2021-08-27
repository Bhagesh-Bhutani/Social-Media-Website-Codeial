const express = require('express');
const router = express.Router();
const passport = require('passport');

const users_controller = require('../controllers/users_controller');

router.get('/feed', passport.checkAuthentication, users_controller.users_action);

router.get('/sign-out', passport.sign_out_handler ,users_controller.destroySession);

router.get('/update', passport.sign_out_handler, users_controller.getUpdateUserPage);

router.post('/update', passport.sign_out_handler, users_controller.updateUser);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/signin'}), users_controller.redirectToFeed);

router.use('/profile', require('./profile'));

module.exports = router;