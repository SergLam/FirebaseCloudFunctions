const helper = require('../helpers/helper.js');
const create_token = require('./create_token.js');

exports.handler = function(req, res, firestore, app) {
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

  app.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential  => {
      const userRef = firestore.collection('users').doc(uid);
      var user = ""
      // Search by email in collection
      var promise = usersRef.where('email', '==', email).get()
        .then(snapshot => {
        snapshot.forEach(doc => {
          if(doc.data().email === email){
            const token = create_token.createCustomToken(firestore, app, doc.data().uid)
            user = doc.data();
            user['customToken'] = token
          }
        });
        // RETURN RESULT AFTER THEN (OR THROW)!!
        if(user === ""){
          return res.status(400).send({ message: "email not registered" });
        }else{
          return res.status(200).send({ "user" : user});
        }
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
      return res.status(200).send({ "user" : user});
    })
    .catch(function(error) {
        // Handle Errors here.
        return res.status(400).send({ error: error.message });
    });

}
