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
  var password = "";
  const usersRef = firestore.collection('users');

  if (req.body.hasOwnProperty("email")) {
    email = req.body.email;
  } else {
    return res.status(400).send({ error: "email field is missing" });
  }

  if (req.body.hasOwnProperty("password")) {
    password = req.body.password;
  } else {
    return res.status(400).send({ error: "password field is missing" });
  }

  // Validate email
  var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(regex.test(email)){
    var user = ""
    // Search by email in collection
    var promise = usersRef.where('email', '==', email).get()
      .then(snapshot => {
      snapshot.forEach(doc => {
        if(doc.data().email === email){
          user = doc.data();
        }
      });
      return user;
    })
    .catch(err => {
      console.log('Error getting documents', err);
      return res.status(400).send({ error: "firebase internal error" });
    });
      // RETURN RESULT AFTER THEN (OR THROW)!!
      if(user === ""){
        // TODO: Add user to users collection

        const createdAt = helper.is_undefined(req.body.createdAt);
        const email = helper.is_undefined(req.body.email);
        const firstName = helper.is_undefined(req.body.firstName);
        const lastName = helper.is_undefined(req.body.lastName);
        const displayName = helper.is_undefined(req.body.displayName);
        const photoURL = helper.is_undefined(req.body.photoURL);
        const lastSignInTime = helper.is_undefined(req.body.lastSignInTime);
        const longitude = helper.is_undefined(req.body.location.longitude);
        const latitude = helper.is_undefined(req.body.location.latitude);

        // Add a new document with a generated id.
        var newUserRef = usersRef.doc();
        const new_user = {
           uid: newUserRef.id,
           createdAt: createdAt,
           email: email,
           displayName: displayName,
           photoURL: photoURL,
           lastSignInTime: lastSignInTime,
           notification_tokens: {
             token: true
           }
         };
        // Add user to auth table
        admin.auth().createUser({
          uid: newUserRef.id,
          email: email,
          emailVerified: false,
          password: password,
          displayName: displayName,
          photoURL: photoURL,
          disabled: false
        })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully created new user:", userRecord.uid);
          var setDoc = newUserRef.set(
             new_user
            ).then(ref => {
              console.log('Added user with ID: ', newUserRef.id);
              return res.status(200).send(new_user);
            });
            return res.status(200).send(new_user);
        })
        .catch(function(error) {
          console.log("Error creating new user:", error);
        });
      } else{
        return res.status(400).send({ message: "email already registered" });
      }
  } else {
    return res.status(400).send({ message: "invalid email" });
  }
});
