Meteor.startup(function () {
  // Parties.remove({});
  if (Parties.find().count() === 0) {
  }
});