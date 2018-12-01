'use strict';
const add_user = require('./auth/add_user.js');
const sign_in = require('./auth/sign_in.js');
const sign_up = require('./auth/sign_up.js');
const helper = require('./helpers/helper.js');
const get_user_by_email = require('./users/get_user_by_email.js');
const update_user = require('./users/update_user.js');
const users = require('./users/users.js');

// Note do below initialization tasks in index.js and
// NOT in child functions:
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');
const firebase = require("firebase");
const app = admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://fir-auth-training.firebaseio.com",
apiKey: 'AIzaSyDngcjhPoyl_cct51Y_4gVNAVDSh4ihmlk',
authDomain: 'https://accounts.google.com/o/oauth2/auth',
projectId: 'fir-auth-training'
});

const firestore = app.firestore();
const database = app.database();
const auth = app.auth();

// Disable deprecated features
firestore.settings({
  timestampsInSnapshots: true
});

// Pass database to child functions so they have access to it
exports.add_user = functions.auth.user().onCreate((user, firestore) => {
    add_user.handler(user, firestore);
});

exports.sign_in = functions.https.onRequest((req, res) => {
    sign_in.handler(req, res, firestore, firebase, auth);
});

exports.sign_up = functions.https.onRequest((req, res) => {
    sign_up.handler(req, res, firestore, firebase, auth);
});

exports.get_user_by_email = functions.https.onRequest((req, res) => {
    get_user_by_email.handler(req, res, firestore, firebase);
});

exports.update_user = functions.https.onRequest((req, res) => {
    update_user.handler(req, res, firestore, firebase);
});

exports.users = functions.https.onRequest((req, res) => {
    users.handler(req, res, firestore, firebase);
});
