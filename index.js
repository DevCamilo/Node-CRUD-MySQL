// Importaciones
const express = require('express');
const morgan = require('morgan');
const expHds = require('express-handlebars');
const path = require('path');
const conFlash = require('connect-flash');
const session = require('express-session');
const mysqlSession = require('express-mysql-session');
const passport = require('passport');
const { database } = require('./keys');

// Inicialización
const app = express();
require('./lib/passport'); // Trae el archivo con la autenticación

// Configuraciones
app.set('views', path.join(__dirname, 'views'));
app.engine(`.hbs`, expHds({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layout'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
// Estrictamente debe llamarse "view engine" ya probé con otros nombres y no funcciona
app.set('view engine', '.hbs');

// Middleware
app.use(session({
    secret: 'papanicolau:v', // No importa el texto
    resave: false, // Evita que se renueve la sesión 
    saveUninitialized: false, // No se reestablezca la sesión
    store: new mysqlSession(database) // Se pasan los parametros de la base de datos para guardar las sesiones allí
}));
app.use(conFlash()); // Inicializa flash
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Variables Globales
app.use((req, res, next) => {
    // Para que flash funcione necesita de una sesión
    app.locals.success =  req.flash('success');
    app.locals.message =  req.flash('message');
    app.locals.user = req.user;
    next();
});
// Rutas
app.use(require('./routes/main_routes'));
app.use(require('./routes/links_routes'));
app.use(require('./routes/auth_routes'));

// Publico
app.use(express.static(path.join(__dirname, "public")));

// Inicio de  Servidor
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo');
});