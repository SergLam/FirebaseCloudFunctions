const helper = require('../helpers/helper.js');

exports.handler = function(req, res, firestore, auth) {
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
    auth.getUserByEmail(email).then(user => { 
      // User already exists
      return res.status(400).send({ error: "User already exist" });
    }).catch(err => { 
      if (err.code === 'auth/user-not-found') {
        // User doesn't exist yet, create it...
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
         auth.createUser({
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
      }
    })
  } else {
    return res.status(400).send({ message: "invalid email" });
  }
}
