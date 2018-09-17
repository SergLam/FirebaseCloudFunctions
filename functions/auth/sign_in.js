const helper = require('../helpers/helper.js');

exports.handler = function(req, res, firestore, firebase) {
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

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential  => {
      return res.status(200).send(userCredential);
    })
    .catch(function(error) {
        // Handle Errors here.
        return res.status(400).send({ error: error.code+"\n"+error.message });
    });

}
