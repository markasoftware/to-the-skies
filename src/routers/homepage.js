const express = require('express');

const router = express.Router();

router.get('/index.html', (req, res) => {
    res.redirect('/');
});

router.get('/', (req, res, next) => {
    if(req.user && typeof req.query.li === 'undefined') {
        res.redirect('/?li');
        return;
    }
    if((!req.user) && typeof req.query.li !== 'undefined') {
        res.redirect('/');
        return;
    }
    next();
});

module.exports = router;
