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
	SearchSource.defineSource('homes', function(searchText, opts) {
	  var options = {sort: {position: 1}};
	  if(searchText) {
	    var regExp = buildRegExp(searchText);
	    var selector = {$or: [
	      {name: regExp},
	      {notes: regExp}
	    ]};
          return Homes.find(selector, options).fetch();
	  } else {
	      return Homes.find({}, options).fetch();
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
