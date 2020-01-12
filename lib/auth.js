module.exports = {
    isLoggedIn(req, res, next) {
        // Verifica si el usuario se ha logeado
        if(req.isAuthenticated()){
            return next();
        } else {
            return res.redirect('/signin');
        }
    }
}