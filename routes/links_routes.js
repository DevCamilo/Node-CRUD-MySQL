const express = require('express');
const route = express.Router();
const db = require('../db');
const auth = require('../lib/auth');

route.get('/add', auth.isLoggedIn, (req, res) => {
    res.render('links/add');
});

route.post('/add', auth.isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await db.query('INSERT INTO links SET ?', [newLink]);
    // Para que flash funcione necesita de una sesión
    req.flash('success', 'Link agregado correctamente');
    res.redirect('/list');
});

route.get('/list', auth.isLoggedIn, async (req, res) => {
    const links = await db.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

route.get('/delete/:id', auth.isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link eliminado exitósamente')
    res.redirect('/list');
});

route.get('/edit/:id', auth.isLoggedIn, async (req, res) => {
    const { id } = req.params;
    // La consulta retorna un arreglo de datos
    const link = await db.query('SELECT * FROM links WHERE ID = ?', [id]);
    res.render('links/edit', { link: link[0] });
});

route.post('/edit/:id', auth.isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await db.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link actualizado extósamente');
    res.redirect('/list');
});

module.exports = route;