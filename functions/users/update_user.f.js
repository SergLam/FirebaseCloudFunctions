const init = require('../init_app.js');
const functions = require('firebase-functions');
const admin = init.init_app();
const firestore = admin.firestore();
const helper = require('../helpers/helper.js');

module.exports = functions.https.onRequest((req, res) => {

var uid = "";
var user = {};

if (req.body.hasOwnProperty("uid")) {
  uid = req.body.uid;
} else {
  res.status(400).send({ error: "uid field is missing" });
  return;
}

if (req.body.hasOwnProperty("user")) {
  user = req.body.user;
} else {
  res.status(400).send({ error: "user object is missing" });
  return;
}

const users = firestore.collection('users');

const createdAt = helper.is_undefined(user.createdAt);
const email = helper.is_undefined(user.email);
const displayName = helper.is_undefined(user.displayName);
const photoURL = helper.is_undefined(user.photoURL);
const lastSignInTime = helper.is_undefined(user.lastSignInTime);

users.doc(uid).update({
    uid: uid,
    createdAt: createdAt,
    email: email,
    displayName: displayName,
    photoURL: photoURL,
    lastSignInTime: lastSignInTime
  });
res.status(200).send({ message: "user updated" });
return;
});
