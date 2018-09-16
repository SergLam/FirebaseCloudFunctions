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

  // var app = admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://fir-auth-training.firebaseio.com"
  // });
  // var app = firebase.app("fir-auth-training");
  // return res.status(200).send(userRecord);
  app.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
    .then(userCredential  => {
      return res.status(200).send(userRecord.user);
    })
    .catch(function(error) {
        // Handle Errors here.
        return res.status(400).send({ error: err.code+"\n"+err.message });
    });

  // admin.auth().getUserByEmail(email).then(userRecord => {
  //   if(userPasswordHash === passwordHash){
  //     return res.status(200).send(userRecord);
  //   } else {
  //     // return res.status(200).send(userRecord);
  //     return res.status(400).send({ error: "email or password is incorrect" });
  //   }
  // }).catch(err => {
  //     return res.status(400).send({ error: err.code+"\n"+err.message });
  // });

});
