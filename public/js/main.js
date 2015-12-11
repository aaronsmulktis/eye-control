/*global google Coords Meteor Homes */

// var homes = [
//   ['Elysten', 51.523325, -0.183299, '/home1'],
//   ['Gateways', 51.501483, -0.141948, '/home1'],
//   ['Ministry of Sound', 51.497740, -0.099440, '/home1'],
//   ['22 Hugon Road', 51.467892, -0.191422, '/home1'],
//   ['Radcliff House', 51.490478, -0.061075, '/home1']
// ];

jQuery(document).ready(function($) {
    var deleteLinks = document.querySelectorAll('.delete');

    for (var i = 0; i < deleteLinks.length; i++) {
        deleteLinks[i].addEventListener('click', function(event) {
            event.preventDefault();

            var choice = confirm(this.getAttribute('data-confirm'));

            if (choice) {
                document.querySelector(".trigger").onclick()
            }
        });
    }

    // // Set thumbnail to height of list item
    // var description = $("div.description");
    // var big =0;
    // description.each(function(index, el) {
    //   if($(el).height() > big)
    //     big =$(el).height(); //find the largest height
    // });
    // description.each(function(index, el) {
    //   $(el).css("min-height", big+"px"); //assign largest height to all the divs
    // });
});
