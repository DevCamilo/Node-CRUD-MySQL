const express = require('express');
const routes = express.Router();
const passport = require('passport');
const auth = require('../lib/auth');

routes.get('/signup', (req, res) => {
    res.render('auth/sing_up');
});

routes.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile', // Es la prepiedad que indica si todo salió bien
    failureRedirect: '/signup',
    failureFlash: true
}));

routes.get('/signin', (req, res) => {
    res.render('auth/sign_in');
});

routes.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

routes.get('/profile', auth.isLoggedIn, (req, res) => {
    res.render('profile');
});

routes.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = routes;