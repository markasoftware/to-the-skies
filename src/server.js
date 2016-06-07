"use strict";

//external dependencies
const express = require('express');
const app = express();
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const pg = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

//internal dependencies
var db = require('./db-interface');

app.use(express.static('public'));
app.use(session({
    store: new pgSession({
        pg: pg,
        conString: conString,
        tableName: 'session'
    }),
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET || 'taco cat',
    cookie: { maxAge: 20 * 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new googleStrategy({
        clientID: process.env.GOOGLECLIENTID||'aoeu',
        clientSecret: process.env.GOOGLECLIENTSECRET||'aoeu',
        callbackURL: 'http://' + (process.env.HOST_AND_PORT || 'localhost:1337') + '/auth/google/callback'
    }, loginOrCreate
));


function loginOrCreate(accessToken, refreshToken, profile, cb){
    var userID;
    pg.connect(conString, function(err, client, done){
        if(err) return;
        var selectQuery = client.query('SELECT userid FROM users WHERE googleid = $1', [profile.id]);
        selectQuery.once('row', (row) => userID = row.userid);
        selectQuery.once('end', function(){
            if(!userID){
                var insertQuery = client.query('INSERT INTO users (googleid) VALUES ($1) RETURNING userid',  [profile.id]);
                insertQuery.once('row', (insertedRow) => userID = insertedRow.userid, done);
            }
            else { done(); }
        });
    });
        
    cb(null, userID);
}

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

app.get('/auth/google/init',
    passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/callback',
    function(req, res, next){
        if(!process.env.PRODUCTION){
            loginOrCreate(null, null, {id: req.query.id}, function(foo, userID){
                req.login(userID, function(){
                    res.redirect('/');
                    next('route');
                });
            });
        } else { next(); }
    },
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res){
        res.redirect('/');
    }
);

module.exports = app;
