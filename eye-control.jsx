if (Meteor.isClient) {
	var options = {
	  keepHistory: 100 * 60 * 5,
	  localSearch: true
	};
	var fields = ['homeName', 'description'];

	HomeSearch = new SearchSource('homes', fields, options);

	Meteor.startup(function () {
	});
}

if (Meteor.isServer) {

	SearchSource.defineSource('homes', function(searchText, options) {
	  var options = {sort: {position: 1}, limit: 20};
	  if(searchText) {
	    var regExp = buildRegExp(searchText);
	    var selector = {$or: [
	      {name: regExp},
	      {notes: regExp}
	    ]};
	    
	     var homes = Homes.find(selector, options).fetch();
	     console.log(homes)
	     return homes;
	  } else {
	    return Homes.find().fetch();
	  }
	});

	function buildRegExp(searchText) {
	  // this is a dumb implementation
	  var parts = searchText.trim().split(/[ \-\:]+/);
	  return new RegExp("(" + parts.join('|') + ")", "ig");
	}

	Meteor.startup(function () {
	});
}
