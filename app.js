import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import postModel from './models.js';

import apiV1router from './routes/api/v1/apiv1.js';
import apiV2router from './routes/api/v2/apiv2.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';


// To install msal-node-wrapper, run:
//     npm install https://gitpkg.now.sh/kylethayer/ms-identity-javascript-nodejs-tutorial-msal-node-v2-/Common/msal-node-wrapper?main
// NOTE: Mac zsh shell seems to block this command as being sketchy (they are not wrong)
//           instead try bash shell or another shell to do this npm install

import WebAppAuthProvider from 'msal-node-wrapper'

const authConfig = {
	auth: {
		clientId: "b9729840-2121-46ec-b898-9fb20f1521ee",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "Client or Application secret here (NOT THE 'secret id', but the 'secret value')",
        redirectUri: "https://a4-website-sharer-deploy.me/redirect"
	},

	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
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

app.use('/api/v2', apiV2router);
app.use('/api/v1', apiV1router);

export default app;
