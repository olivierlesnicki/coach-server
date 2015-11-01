var ref = require('../ref');
var incomings = require('./incomings');
var outgoings = require('./outgoings');

ref
  .child('messages')
  .orderByChild('timestamp')
  .startAt(new Date().getTime())
  .on('child_added', (snapshot) => {

    var message = snapshot.val();

    if (message.coach === true) {
      outgoings(message);
    } else {
      incomings(message);
    }

  });
