Speeches = new Mongo.Collection("speeches");

Speeches.allow({
  insert: function (userId, speech) {
    console.log('insert speech - ' +userId+ '');
    return userId && speech.owner === userId;
  },
  update: function (userId, speech, fields, modifier) {
    var currrentUser = Meteor.users.findOne(Meteor.userId());
    if (currrentUser.emails[0].address == 'a.dankoff@gmail.com')
      return true;

    if (userId !== speech.owner)
      return false;

    return true;
  },
  remove: function (userId, speech) {
    if (userId !== speech.owner)
      return false;

    return true;
  }
});

