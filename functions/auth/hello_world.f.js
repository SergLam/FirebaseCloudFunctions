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

exports = module.exports = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});
