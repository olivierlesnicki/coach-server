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
};
