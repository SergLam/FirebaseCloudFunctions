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

module.exports = functions.https.onRequest((req, res) => {
var email = "";

if (req.body.hasOwnProperty("email")) {
  email = req.body.email;
} else {
  return res.status(400).send({ error: "email field is missing" });
}

const users = firestore.collection('users');
var isUpdated = false;
var updatedUser = {};

var promise = users.where('email', '==', email).get()
  .then(snapshot => {
  snapshot.forEach(doc => {
    if(doc.data().email === email){
      const createdAt = helper.is_undefined(req.body.createdAt);
      const email = helper.is_undefined(req.body.email);
      const firstName = helper.is_undefined(req.body.firstName);
      const lastName = helper.is_undefined(req.body.lastName);
      const displayName = helper.is_undefined(req.body.displayName);
      const photoURL = helper.is_undefined(req.body.photoURL);
      const lastSignInTime = helper.is_undefined(req.body.lastSignInTime);
      const longitude = helper.is_undefined(req.body.location.longitude);
      const latitude = helper.is_undefined(req.body.location.latitude);

      users.doc(doc.id).update({
          createdAt: createdAt,
          email: email,
          firstName: firstName,
          lastName: lastName,
          displayName: displayName,
          photoURL: photoURL,
          lastSignInTime: lastSignInTime,
          location: {
            latitude: latitude,
            longitude: longitude
          }
        });

        isUpdated = true;
        updatedUser = doc.data();
    }
  });
  // RETURN RESULT AFTER THEN (OR THROW)!!
  if(!isUpdated){
    return res.status(400).send({ message: "email not registered" });
  }else{
    return res.status(200).send(updatedUser);
  }
})
.catch(err => {
  console.log('Error getting documents', err);
});

});
