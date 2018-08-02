// Firebase App is always required and must be first
const firebase = require('firebase');
// Add additional services that you want to use
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

exports.init_app = function init_app() {

  var app = firebase.apps[0];

  if(!firebase.apps.length){
    try {
      app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://fir-auth-training.firebaseio.com"
    });
    } catch (e) { console.log(e) }
  }
  return admin;
};
