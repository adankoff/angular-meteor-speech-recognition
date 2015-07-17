Meteor.publish("parties", function (options, searchString) {
  if (searchString == null)
    searchString = '';

  Counts.publish(this, 'numberOfParties', Parties.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[ {} ]}), { noReady: true });
  return Parties.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[ {status: {$in: ["live", "saved"]}} ]} ,options);

});