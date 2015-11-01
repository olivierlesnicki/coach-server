var request = require('request');
var express = require('express');
var router = express.Router();

var Twitter = require('node-twitter-api');
var FirebaseTokenGenerator = require("firebase-token-generator");

var token = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);

router.post('/', function(req, res) {

  var client = new twitterAPI({
    consumerKey: process.env.DIGITS_CONSUMER_KEY,
    consumerSecret: process.env.DIGITS_CONSUMER_SECRET,
  });

  client.verifyCredentials(req.body.token, req.body.secret, (err, data) => {
    if (err || !data) {
      return res
        .status(403)
        .send(err);
    }

    return res.send({
      firebaseToken: token.createToken({
        uid: `digits:${data.id}`,
      }),
    });
  });

});

module.exports = router;
