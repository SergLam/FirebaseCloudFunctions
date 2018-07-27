// Firebase App is always required and must be first
const firebase = require('firebase');
// Add additional services that you want to use
const functions = require('firebase-functions')
const admin = require('firebase-admin')

var serviceAccount = require("../../fir-auth-training-firebase-adminsdk-6v07r-9cc21f3844.json");

try {
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-auth-training.firebaseio.com"
});

} catch (e) { console.log(e) }


exports = module.exports = functions.auth.user().onCreate(event => {

  const config = functions.config();

  const user = event.data;
  const db = firebase.firestore();
  const users = db.collection('users')

  return users.add(user);
});
