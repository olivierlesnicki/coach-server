var express = require('express');
var bodyParser = require('body-parser');
var Firebase = require('firebase');
var request = require('request-promise');

var SLACK_COMMAND_REPLY_TOKEN = process.env.SLACK_COMMAND_REPLY_TOKEN;
var SLACK_INCOMING_WEBHOOK_COACH_URL = process.env.SLACK_INCOMING_WEBHOOK_COACH_URL;
var SLACK_WEB_API_TOKEN = process.env.SLACK_WEB_API_TOKEN;
var FIREBASE_REF = process.env.FIREBASE_REF;

var app = express();
var ref = new Firebase(FIREBASE_REF);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ref
//   .child('incoming-messages')
//   .orderByChild('timestamp')
//   .startAt(new Date().getTime())
//   .on('child_added', function(snapshot) {
//     var message = snapshot.val();
//
//     request({
//       method: 'POST',
//       uri: 'https://slack.com/api/channels.create',
//       body: {
//         token: SLACK_WEB_API_TOKEN,
//         name: message.text,
//       },
//       json: true,
//     }).then(() => {
//       return Promise.resolve();
//     }, () => {
//       return new Promise((resolve, reject) => {
//         console.log(arguments);
//       });
//     }).then(() => {
//
//       // Post the message as the user on slack
//       request({
//         method: 'POST',
//         uri: SLACK_INCOMING_WEBHOOK_COACH_URL,
//         body: {
//           username: message.from,
//           text: message.text,
//           channel: '#' + message.from,
//         },
//         json: true,
//       });
//
//       // Store the message in the thread
//       ref
//         .child('threads')
//         .child(message.from)
//         .push({
//           text: message.text,
//           timestamp: Firebase.ServerValue.TIMESTAMP,
//           coach: false,
//         });
//
//     });
//
//   });

// import the queues
require('./lib/queues/messages');

// import the routes
app.use('/slack/command/reply', require('./lib/routes/slack/command/reply'));
app.use('/login', require('./lib/routes/login'));

var server = app.listen(process.env.PORT || 9000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
