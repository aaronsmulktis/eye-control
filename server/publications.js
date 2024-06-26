Meteor.publish('homes', function() {
    return Homes.find({});
});

Meteor.publish('home', function(id) {
    return Homes.find({_id: id});
});

Meteor.publish('rooms', function() {
    return Rooms.find({}, {
      sort: {
          position: 1
      }
    });
});

Meteor.publish('roomsMatching', function(homeId) {
        return Rooms.find({homeId: homeId}, {
            sort: {
                position: 1
            }
        })
});

Meteor.publish('coords', function() {
    return Coords.find({});
});

Meteor.publish('spheres', function() {
    return Spheres.find({});
});

Meteor.publish('sphere', function(id) {
    return Spheres.find({_id: id});
});

Meteor.publish('notes', function() {
    return Notes.find({});
});
