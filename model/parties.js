Parties = new Mongo.Collection("parties");

Parties.allow({
  insert: function (userId, party) {
    console.log('insert party - ' +userId+ '');
    return userId && party.owner === userId;
  },
  update: function (userId, party, fields, modifier) {
    var currrentUser = Meteor.users.findOne(Meteor.userId());
    if (currrentUser.emails[0].address == 'a.dankoff@gmail.com')
      return true;

    if (userId !== party.owner)
      return false;

    return true;
  },
  remove: function (userId, party) {
    if (userId !== party.owner)
      return false;

    return true;
  }
});

