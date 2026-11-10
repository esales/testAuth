const express = require('express');
const router = express.Router();

const { autenticado } = require('../middlewares/auth');

router.get('/', autenticado, (req, res) => {
    res.render('home', { usuario: req.user });
});

module.exports = router;