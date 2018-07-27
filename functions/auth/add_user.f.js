// Firebase App is always required and must be first
const firebase = require("firebase");
// Add additional services that you want to use
const admin = require('firebase-admin');
const functions = require('firebase-functions');
// require("firebase-auth");
// require("firebase-database");
// require("firebase-firestore");
// require("firebase-messaging");
// require("firebase-functions");

// if (!firebase.apps.length) {
//   admin.initializeApp(functions.config().firebase);
// }

exports = module.exports = functions.auth.user().onCreate(event => {
  const config = functions.config();

  const user = event.data;
  const userRef = admin.database().ref('/users').child(user.uid);

  return userRef.update(user);
});
