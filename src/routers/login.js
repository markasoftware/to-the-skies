const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const mainRouter = require('express').Router();
const router = require('express-promise-router')();
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const bluebird = require('bluebird');

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

mainRouter.use(passport.initialize());
mainRouter.use(passport.session());

router.get('/auth/google/init',
    passport.authenticate('google', { scope: ['profile'] })
);

router.get('/auth/google/callback',
    async((req, res) => {
        if(process.env.NODE_ENV !== 'PRODUCTION'){
            const userID = await(dbInt.login(req.query.id));
            await(bluebird.promisify(req.login)(userID));
            res.redirect('/');
            return 'route';
        } else { return 'next'; }
    }),
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res){
        res.redirect('/');
    }
);

mainRouter.use(router);

module.exports = mainRouter;
