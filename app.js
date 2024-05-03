import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import postModel from './models.js';
import sessions from "express-session"

import apiV1Router from './routes/api/v1/apiv1.js';
import apiV2Router from './routes/api/v2/apiv2.js';
import apiV3Router from './routes/api/v3/apiv3.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';


// To install msal-node-wrapper, run:
//     npm install https://gitpkg.now.sh/kylethayer/ms-identity-javascript-nodejs-tutorial-msal-node-v2-/Common/msal-node-wrapper?main
// NOTE: Mac zsh shell seems to block this command as being sketchy (they are not wrong)
//           instead try bash shell or another shell to do this npm install

import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
	auth: {
		clientId: "7ea064a6-561a-4b1d-8de0-ddf159a68b88",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "hSB8Q~ZgkV5kvCLzihotlXqproETmsqoYzjgmbPX')",
        redirectUri: "https://a4-website-sharer-deploy.me/redirect"
	},

	system: {
    	loggerOptions: {
        	loggerCallback(message) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.models = postModel;
    next();
});


const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate())

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/",
    })
    (req, res, next);
});

app.get( '/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/",
    })
    (req, res, next);
});

app.use(authProvider.interactionErrorHandler());
app.use('/api/v3', apiV3Router);
app.use('/api/v2', apiV2Router);
app.use('/api/v1', apiV1Router);

// use this by going to urls like: 
// http://localhost:3000/fakelogin?name=anotheruser
app.get('/fakelogin', (req, res) => {
    let newName = req.query.name;
    let session=req.session;
    session.isAuthenticated = true;
    if(!session.account){
        session.account = {};
    }
    session.account.name = newName;
    session.account.username = newName;
    console.log("set session");
    res.redirect("/api/v3/myIdentity");
});

// use this by going to a url like: 
// http://localhost:3000/fakelogout
app.get('/fakelogout', (req, res) => {
    let newName = req.query.name;
    let session=req.session;
    session.isAuthenticated = false;
    session.account = {};
    console.log("you have fake logged out");
    res.redirect("/api/v3/users/myIdentity");
});



export default app;
