Notes = new Mongo.Collection("notes");
Homes = new Mongo.Collection("homes");
Rooms = new Mongo.Collection("rooms");

// Support draggable roomlist
Sortable.collections = <Rooms>;

if (Meteor.isClient) {
  // This code is executed on the client only
 
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    ReactDOM.render(<Map />);
  });
}

if (Meteor.isServer) {
  // This code is executed on the server only
 
  Meteor.startup(function () {
  });
}