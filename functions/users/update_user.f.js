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
  return res.status(400).send({ error: "uid field is missing" });
}

if (req.body.hasOwnProperty("user")) {
  user = req.body.user;
} else {
  return res.status(400).send({ error: "user object is missing" });
}

if (req.body.user.hasOwnProperty("email")) {
  user["email"] = req.body.user.email;
} else {
  return res.status(400).send({ error: "user email is missing" });
}

const users = firestore.collection('users');

var getDoc = users.doc(uid).get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(400).send({ error: "no such user" });
        } else {
          const createdAt = helper.is_undefined(user.createdAt);
          const email = helper.is_undefined(user.email);
          const displayName = helper.is_undefined(user.displayName);
          const photoURL = helper.is_undefined(user.photoURL);
          const lastSignInTime = helper.is_undefined(user.lastSignInTime);
          const longitude = helper.is_undefined(user.location.longitude);
          const latitude = helper.is_undefined(user.location.latitude);

          users.doc(uid).set({
              uid: uid,
              createdAt: createdAt,
              email: email,
              displayName: displayName,
              photoURL: photoURL,
              lastSignInTime: lastSignInTime,
              location: {
                latitude: latitude,
                longitude: longitude
              }
            });
          return res.status(200).send({ message: "user updated" });
        }
    })
    .catch(err => {
        return console.log('Error getting document', err);
    });
});
