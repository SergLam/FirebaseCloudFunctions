// Firebase App is always required and must be first
const firebase = require('firebase');
// Add additional services that you want to use
const functions = require('firebase-functions')
const admin = require('firebase-admin')

var serviceAccount = require('./firebase-adminsdk.json');

var app;

if(!firebase.apps.length){
  try {
    app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-auth-training.firebaseio.com"
  });
  } catch (e) { console.log(e) }
}

exports = module.exports = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return app.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});
