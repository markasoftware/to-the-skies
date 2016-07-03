const passport = require('passport');
const router = require('express').Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const promisify = require('promisify-es6');
const googleStrategy = require('passport-google-oauth20');

//ugh i need to do a url module thing soon
const dbInt = require('./lib/db-interface.js');

passport.use(new googleStrategy({
        clientID: process.env.GOOGLECLIENTID||'aoeu',
        clientSecret: process.env.GOOGLECLIENTSECRET||'aoeu',
        callbackURL: 'http://' + (process.env.HOST_AND_PORT || 'localhost:1337') + '/auth/google/callback'
    }, async.cps((at, rt, profile) => {
        return await(dbInt.login(profile.id));
    })
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
        try {
            if(process.env.NODE_ENV !== 'PRODUCTION'){
                const userID = await(dbInt.login(req.query.id));
                //for some reason promisifying doesn't work well with this
                await(new Promise((resolve, reject) => {
                    req.login(userID, function(e){
                        if(e) reject(e);
                        else resolve();
                    })
                }));
                res.redirect('/');
                next('route');
            } else { next(); }
        } catch (e) {
            console.error(e);
            res.sendStatus(500).send('login error. Probably bad googleid. Must be 21 digit number').end();
            next('route');
        }
    }),
    passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' })
);

module.exports = router;
