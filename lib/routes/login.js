var request = require('request-promise');
var express = require('express');
var router = express.Router();

var FirebaseTokenGenerator = require("firebase-token-generator");

var token = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);

router.post('/', function(req, res) {

  request({
    method: 'GET',
    uri: req.get('X-Auth-Service-Provider'),
    headers: {
      Authorization: req.get('X-Verify-Credentials-Authorization'),
    },
  })
    .then((data) => {
      res.send({
        firebaseToken: token.createToken({
          uid: 'digits:' + JSON.parse(data).id_str,
        }),
      });
    },

    (err) => {
      res
        .status(403)
        .send(err);
    });

});

module.exports = router;
