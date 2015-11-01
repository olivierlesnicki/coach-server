var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  if (req.body.token === process.env.SLACK_COMMAND_REPLY_TOKEN) {

    // Post the reply
    // as coach on slack
    request({
      method: 'POST',
      uri: process.env.SLACK_INCOMING_WEBHOOK_COACH_URL,
      body: {
        username: 'coach',
        text: req.body.text,
        channel: '#' + req.body.channel_name,
      },
      json: true,
    });

    // Store the reply in the
    // corresponding firebase thread
    ref
      .child('threads')
      .child(req.body.channel_name)
      .push({
        text: req.body.text,
        timestamp: Firebase.ServerValue.TIMESTAMP,
        coach: true,
      });

    res.send();

  } else {
    res
      .status(403)
      .send();
  }

});

module.exports = router;
