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

const firestore = app.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

exports = module.exports = functions.auth.user().onCreate(user => {

  const uid = user.uid;
  const email = (typeof user.email === 'undefined') ? null : user.email; // The email of the user.
  const displayName = (typeof user.displayName === 'undefined') ? null : user.displayName; // The display name of the user.
  const photoURL = (typeof user.providerData.photoURL === 'undefined') ? null : user.providerData.photoURL;
  const createdAt= (typeof user.metadata.creationTime === 'undefined') ? null : user.metadata.creationTime;
  const lastSignInTime = (typeof user.metadata.lastSignInTime === 'undefined') ? null : user.metadata.lastSignInTime;
  const users = firestore.collection('users');

  return users.doc(uid).set({
      uid: uid,
      created: createdAt,
      email: email,
      displayName: displayName,
      photoURL: photoURL,
      lastSignInTime: lastSignInTime
    });
});
