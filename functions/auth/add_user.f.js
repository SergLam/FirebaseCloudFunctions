const helper = require('../helpers/helper.js');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');
const firebase = require("firebase");
try {
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-auth-training.firebaseio.com"
});
} catch (e) {
  console.log(e);
}
const firestore = admin.firestore();
const init = require('../init_app.js');

module.exports = functions.auth.user().onCreate(user => {

  const uid = helper.is_undefined(user.uid);
  const email = helper.is_undefined(user.email);
  const displayName = helper.is_undefined(user.displayName); // The display name of the user.
  const photoURL = helper.is_undefined(user.providerData.photoURL);
  const createdAt= helper.is_undefined(user.metadata.creationTime);
  const lastSignInTime = helper.is_undefined(user.metadata.lastSignInTime);

  const users = firestore.collection('users');

  return users.doc(uid).set({
      uid: uid,
      createdAt: createdAt,
      email: email,
      displayName: displayName,
      photoURL: photoURL,
      lastSignInTime: lastSignInTime,
      notification_tokens: {
        token: true
      }
    });
});
