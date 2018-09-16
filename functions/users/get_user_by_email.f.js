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

  const usersRef = firestore.collection('users');
  var email = "";

  if (req.body.hasOwnProperty("email")) {
    email = req.body.email;
  } else {
    return res.status(400).send({ error: "email field is missing" });
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
      // RETURN RESULT AFTER THEN (OR THROW)!!
      if(user === ""){
        return res.status(400).send({ message: "email not registered" });
      }else{
        return res.status(200).send(user);
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  } else {
    return res.status(400).send({ message: "invalid email" });
  }
});
