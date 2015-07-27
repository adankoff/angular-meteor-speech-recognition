Meteor.publish("speeches", function (options, searchString) {
  if (searchString == null)
    searchString = '';

  Counts.publish(this, 'numberOfSpeeches', Speeches.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[ {} ]}), { noReady: true });
  return Speeches.find({
    'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' },
    $or:[ {status: {$in: ["live", "saved"]}} ]} ,options);

});