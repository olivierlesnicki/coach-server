var request = require('request');
var express = require('express');
var router = express.Router();

var Twitter = require('twitter');
var FirebaseTokenGenerator = require("firebase-token-generator");

var token = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);

router.post('/', function(req, res) {

  var client = new Twitter({
    consumer_key: process.env.DIGITS_CONSUMER_KEY,
    consumer_secret: process.env.DIGITS_CONSUMER_SECRET,
    access_token_key: req.body.token,
    access_token_secret: req.body.secret
  });

  console.log(req.body.token, req.body.secret);

  client.get('account/verify_credentials', {}, (err, data) => {
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
