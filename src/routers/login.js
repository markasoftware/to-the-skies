'use strict';

const passport = require('passport');
const router = require('express').Router();
const GoogleStrategy = require('passport-google-oauth20');

require('./lib/general.js');

const dbInt = require('./lib/db-interface.js');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'aoeu',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'aoeu',
    callbackURL: `http://${process.env.HOST_AND_PORT || 'localhost:1337'}/auth/google/callback`,
}, async.cps((at, rt, profile) => await(dbInt.login(profile.id)))
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/auth/google/init',
    passport.authenticate('google', { scope: ['profile'] })
);

router.get('/auth/google/callback',
    async((req, res, next) => {
        if (process.env.NODE_ENV !== 'PRODUCTION' && req.query.id) {
            const userID = await(dbInt.login(req.query.id));
            // for some reason promisifying doesn't work well with this
            await(new Promise((resolve, reject) => {
                req.login(userID, (e) => {
                    if (e) reject(e);
                    else resolve();
                });
            }));
            res.redirect('/');
        } else next();
    }),
    passport.authenticate('google', { failureRedirect: '/', successRedirect: '/' })
);

module.exports = router;
