var ref = require('../ref');

module.exports = function(message) {

  ref
    .child('threads')
    .child(message.user)
    .push({
      text: message.text,
      timestamp: message.timestamp,
      coach: false,
    });

  // Post the reply
  // as coach on slack
  request({
    method: 'POST',
    uri: process.env.SLACK_INCOMING_WEBHOOK_COACH_URL,
    body: {
      username: message.user,
      text: message.text,
      channel: '#coach',
    },
    json: true,
  });

};
