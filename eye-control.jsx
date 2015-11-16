// Define a collection to hold our tasks
Tasks = new Mongo.Collection("tasks");
Homes = new Mongo.Collection("homes");

if (Meteor.isClient) {
  // This code is executed on the client only
 
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<Map />);
  });
}