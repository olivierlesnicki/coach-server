var express = require('express');
var bodyParser = require('body-parser');
var Firebase = require('firebase');
var request = require('request-promise');

var SLACK_COMMAND_REPLY_TOKEN = process.env.SLACK_COMMAND_REPLY_TOKEN;
var SLACK_INCOMING_WEBHOOK_COACH_URL = process.env.SLACK_INCOMING_WEBHOOK_COACH_URL;
var FIREBASE_REF = process.env.FIREBASE_REF;

var app = express();
var ref = new Firebase(FIREBASE_REF);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

ref
  .child('incoming-messages')
  .orderByChild('timestamp')
  .startAt(new Date().getTime())
  .on('child_added', function(snapshot) {
    var message = snapshot.val();

    request({
      method: 'POST',
      uri: SLACK_INCOMING_WEBHOOK_COACH_URL,
      body: {
        username: message.from,
        text: message.text,
        channel: '#' + message.from,
      },
      json: true,
    });

    ref
      .child('conversations')
      .child(message.from)
      .push({
        text: message.text,
        timestamp: Firebase.ServerValue.TIMESTAMP,
        coach: false,
      });
  });

app.post('/slack/command/reply', function(req, res) {
  if (req.body.token === SLACK_COMMAND_REPLY_TOKEN) {

    request({
      method: 'POST',
      uri: SLACK_INCOMING_WEBHOOK_COACH_URL,
      body: {
        username: 'coach',
        text: req.body.text,
        channel: '#' + req.body.channel_name,
      },
      json: true,
    });

    ref
      .child('conversations')
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

var server = app.listen(process.env.PORT || 9000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
