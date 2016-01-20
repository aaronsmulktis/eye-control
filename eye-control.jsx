if (Meteor.isClient) {
	var options = {
	  keepHistory: 100 * 60 * 5,
	  localSearch: true
	};
	var homeFields = ['name', 'address', 'notes'];
	var roomFields = ['homeName', 'description'];

	HomeSearch = new SearchSource('homes', homeFields, options);
	RoomSearch = new SearchSource('rooms', roomFields, options);

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
	      {notes: regExp},
	      {address: regExp}
	    ]};
          return Homes.find(selector, options).fetch();
	  } else {
	      return Homes.find({}, options).fetch();
	  }
	});

	SearchSource.defineSource('rooms', function(searchText, opts) {
        var homeId = opts.homeId;
	    var options = {sort: {position: 1}};
	    if(searchText) {
	        var regExp = buildRegExp(searchText);
            var selector = {$and: [{$or:
                                    [
	                                    {name: regExp},
	                                    {desc: regExp}]},
                                   {homeId: homeId}]
            }
            return Rooms.find(selector, options).fetch();
	    } else {
            var selector = {homeId: homeId};
	        return Rooms.find(selector, options).fetch();
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
