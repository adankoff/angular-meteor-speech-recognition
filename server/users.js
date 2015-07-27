Meteor.publish("users", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.users.find({ "status.online": true }).observe({

	connected: 0,

  added: function(id) {
  	this.connected++;
    console.log(id._id + ' connected - total: ' + this.connected);
  },
  removed: function(id) {
  	this.connected--;
  	console.log(id._id + ' disconnected - total: ' + this.connected);
    Speeches.update({owner: id._id}, {$set: {status: 'saved'}}, {multi: true});
  }
});