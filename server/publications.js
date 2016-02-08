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

Meteor.publish("avgLat", function () {
    var sub = this;
    // This works for Meteor 0.6.5
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    // Your arguments to Mongo's aggregation. Make these however you want.
    var pipeline = [
        // { $match: doSomethingWith(args) },
        { $group: {
            // _id: whatWeAreGroupingWith(args),
            _id: "$latitude",
            avg: { $avg: "$latitude" }
        }}
    ];

    db.collection("homes").aggregate(        
        pipeline,
        // Need to wrap the callback so it gets called in a Fiber.
        Meteor.bindEnvironment(
            function(err, result) {
                // Add each of the results to the subscription.
                _.each(result, function(e) {
                    // Generate a random disposable id for aggregated documents
                    sub.added("home_latitudes", e._id, {
                        key: e._id,
                        avg: e.avg
                    });
                });
                sub.ready();
            },
            function(error) {
                Meteor._debug( "Error doing aggregation: " + error);
            }
        )
    );
});