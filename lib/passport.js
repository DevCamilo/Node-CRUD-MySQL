const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');
const helper = require('../lib/helpers');

passport.use('local.signup', new LocalStrategy({
    usernameField: 'user_name', // Se le coloca el nombre del campo del formulario que enviará el dato
    passwordField: 'password',
    passReqToCallback: true
}, async (req, userName, password, done) => {
    const newUser = {
        user_name: userName,
        password,
        full_name: req.body.full_name
    };
    newUser.password = await helper.encryptPassword(password);
    const result = await db.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

// Guarda el usuario en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Elimina el usuario de la sesión
passport.deserializeUser(async (id, done) => {
    const row = await db.query('SELECT * FROM  users WHERE id = ?', [id]);
    done(null, row[0]);
});


passport.use('local.signin', new LocalStrategy({
    usernameField: 'user_name', // Se le coloca el nombre del campo del formulario que enviará el dato
    passwordField: 'password',
    passReqToCallback: true
}, async (req, userName, password, done) => {
    const rows = await db.query('SELECT * FROM users WHERE user_name = ?', [userName]);
    if (rows.length > 0) {
        const user = rows[0];
        const valid = await helper.decryptPassword(password, user.password);
        if (valid) {
            done(null, user, req.flash('success', 'Bienvenido' + user.full_name));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));
