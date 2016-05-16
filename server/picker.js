/*global Picker Coords Homes Rooms Meteor AWS */

var bodyParser = Meteor.npmRequire('body-parser');
Picker.middleware( bodyParser.json({type: 'application/json'}));
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );  
var multiparty = Meteor.npmRequire('multiparty');
var util = Meteor.npmRequire('util');
var s3Client = new AWS.S3({
    accessKeyId: "AKIAIJGHG2GEWKQ3QBKA",
    secretAccessKey: "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"
});

var _getPartHandler = function(res, data_obj, callback) {
    var isImageIncluded = false,
        bucket = "gleitz",
        filename;
    setTimeout(function() {
        if (!isImageIncluded) {
            callback(data_obj, res);
        }
    }, 1000);
    return function(part) {
        if (!part.filename) {
            // this is a field
            var key = part.name,
                value = '';
            if (key == "description") {
                key = "desc";
            }
            part.on('readable',function() {
                var chunk = part.read();
                if (chunk != null) {
                    value += chunk;
                }
            });
            part.on('end',function() {
                data_obj[key] = value;
            });
        } else {
            // this is a file
            if (!filename) {
                filename = part.filename;
            }
            isImageIncluded = true;
            s3Client.putObject({
                Bucket: bucket,
                Key: filename,
                ACL: 'public-read',
                Body: part,
                ContentLength: part.byteCount
            }, function(err, data) {
                if (err) {
                    res.end(JSON.stringify({ok: false}));
                }
                var picUrl = "http://gleitz.s3.amazonaws.com/" + filename;
                data_obj.picUrl = picUrl;
                callback(data_obj, res);
            });
        }
    }
}
var _handlePart = function(res, data_obj, callback, part) {
}
   
Picker.route('/api/v1/coord/update', function(params, req, res, next) {
    var coord = params['query']["coord"];
    var time = params['query']["timestamp"];
    var uid = params['query']["uid"];
    Coords.update({_id:uid}, {$set: {coord:coord, timestamp:time}},{upsert:true});
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ok: true}));
    res.end();
});

Picker.route('/api/v1/template', function(params, req, res, next) {
    var templates = [
        {name: "Front", type: "front"},
        {name: "Bedroom", type: "bedroom"},
        {name: "Bathroom", type: "bathroom"},
        {name: "Kitchen", type: "kitchen"},
        {name: "Living Room", type: "living-room"}
    ]
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ok: true,
                              templates: templates}));
    res.end();
});

var postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
});

var putRoutes = Picker.filter(function(req, res) {
    return req.method == "PUT";
});

var deleteRoutes = Picker.filter(function(req, res) {
    return req.method == "DELETE";
});

var getRoutes = Picker.filter(function(req, res) {
    return req.method == "GET";
});

deleteRoutes.route('/api/v1/property/:home_id/room/:room_id', function(params, req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var homeId = params.home_id;
    var home = Homes.findOne({_id: homeId});
    if (!home) {
        var data = {ok: false,
                    error: "Property '" + params.home_id + "' not found"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    }
    var roomId = params.room_id;
    var room = Rooms.findOne({_id: roomId});
    if (!room) {
        var data = {ok: false,
                    error: "Room '" + params.room_id + "' not found"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    }
    Rooms.remove({_id: roomId});
    res.write(JSON.stringify({
        ok: true
    }));
    res.end();
});

putRoutes.route('/api/v1/property/:home_id/room/:room_id', function(params, req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var homeId = params.home_id;
    var home = Homes.findOne({_id: homeId});
    if (!home) {
        var data = {ok: false,
                    error: "Property '" + params.home_id + "' not found"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    }
    var roomId = params.room_id;
    var room = Rooms.findOne({_id: roomId});
    if (!room) {
        var data = {ok: false,
                    error: "Room '" + params.room_id + "' not found"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    }

    var form = new multiparty.Form({});
    var data_obj = {homeId: homeId,
                    roomId: roomId};
    form.on('part', _getPartHandler(res, data_obj, updateRoom));
    form.parse(req);
});

postRoutes.route('/api/v1/property/:id/room', function(params, req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var homeId = params.id;
    var home = Homes.findOne({_id: homeId});
    if (!home) {
        var data = {ok: false,
                    error: "Property '" + params.id + "' not found"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    }
    var form = new multiparty.Form({});
    var bucket = "gleitz";
    var filename;
    var data_obj = {homeId: homeId};
    form.on('part', _getPartHandler(res, data_obj, insertRoom));
    form.parse(req);
});

var insertRoom = Meteor.bindEnvironment(function(data_obj, res) {
    var rooms = Rooms.find({homeId: data_obj.homeId}).fetch(),
        highest_position = 0;
    for (var i=0; i<rooms.length; i++) {
        var position = rooms[i];
        if (position && position > highest_position) {
            highest_position = position;
        }
    }

    var objectToInsert = {
        position: highest_position === 0 ? 0 : highest_position + 1,
        createdAt: new Date()
    };
    for (var attrname in data_obj) {
        objectToInsert[attrname] = data_obj[attrname];
    }
    Rooms.insert(objectToInsert, function(err, record) {
        res.write(JSON.stringify({
            ok: true,
            roomId: record}));
        res.end();
    });
});

var updateRoom = Meteor.bindEnvironment(function(data_obj, res) {
    var objectToUpdate = {createdAt: new Date()};
    for (var attrname in data_obj) {
        if (attrname != "roomId") {
            objectToUpdate[attrname] = data_obj[attrname];
        }
    }
    Rooms.update({_id: data_obj.roomId},
                 {$set: objectToUpdate}, function(err) {
                     res.write(JSON.stringify({
                         ok: true}));
                     res.end();
                 });
});

getRoutes.route('/api/v1/property', function(params, req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var data = {ok: true,
                properties: []};
    var homes = Homes.find({},
                           {sort: {
                               position: 1
                           }}).fetch();
    for (var i=0; i<homes.length; i++) {
        var home = homes[i],
            rooms = Rooms.find({homeId: home._id},
                               {sort: {
                                   position: 1
                               }}).fetch();
        home.rooms = rooms;
    }
    data.properties = homes;
    console.log(homes);
    res.write(JSON.stringify(data));
    res.end();
});

postRoutes.route('/api/v1/property', function(params, req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var form = new multiparty.Form({});
    var bucket = "gleitz";
    var filename;
    var data_obj = req.body;
    form.on('part', _getPartHandler(res, data_obj, insertProperty));
});

var insertProperty = Meteor.bindEnvironment(function(data_obj, res) {
    if (Object.keys(data_obj).length < 1) {
        res.write(JSON.stringify({
            ok: false,
            error: "Property is empty"
            }));
        res.end();
        return;
    }
    var homes = Homes.find().fetch(),
        highest_position = 0;
    for (var i=0; i<homes.length; i++) {
        var position = homes[i].position;
        if (position && position > highest_position) {
            highest_position = position;
        }
    }

    var objectToInsert = {
        position: highest_position === 0 ? 0 : highest_position + 1,
        createdAt: new Date(),
        name : data_obj.title,
        notes : data_obj.description,
        address : data_obj.address,
        year : data_obj.year,
        latitude : data_obj.latitude,
        longitude : data_obj.longitude,
        type : data_obj['type'],
        numBedrooms : data_obj.numBedrooms,
        numBathrooms : data_obj.numBathrooms,
        price : data_obj.price
    };
   
    Homes.insert(objectToInsert, function(err, record) {
        res.write(JSON.stringify({
            ok: true,
            propertyId: record}));
        res.end();
    });
});

putRoutes.route('/api/v1/property/:id', function(params, req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var data_obj = req.body;
    data_obj.id = params.id;
    var form = new multiparty.Form({});
    var bucket = "gleitz";
    var filename;
    form.on('part', _getPartHandler(res, data_obj, updateProperty));
});

var updateProperty = Meteor.bindEnvironment(function(data_obj, res) {
    var homeId = data_obj.id;
    var home = Homes.findOne({_id: homeId});
    if (!home) {
        var data = {ok: false,
                    error: "Property '" + homeId + "' not found"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    } 
     for (var attrname in data_obj) {
        if (attrname !== "_id") {
            home[attrname] = data_obj[attrname];
        }
    }
    Homes.update({_id: homeId},
                 {$set: home}, function(err, record) {
       res.write(JSON.stringify({
            ok: true
        }));
        res.end();
    });
});

putRoutes.route('/api/v1/property/:id/reorder_rooms', function(params, req, res, next) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var homeId = params.id;
    var home = Homes.findOne({_id: homeId});
    if (!home) {
        var data = {ok: false,
                    error: "Property '" + params.id + "' not found"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    }
    var data_obj = { homeId: homeId, order : req.body.rooms };
    var form = new multiparty.Form({});
    var bucket = "gleitz";
    var filename;
    form.on('part', _getPartHandler(res, data_obj, reorderRooms));
});

var reorderRooms = Meteor.bindEnvironment(function(data_obj, res) {
    var rooms = Rooms.find({homeId: data_obj.homeId}).fetch();
    var order = data_obj.order;

    if (!order || (JSON.stringify(rooms.map(function(a){return a._id}).sort())!=JSON.stringify(order.slice().sort()))){
        var data = {ok: false,
                    error: "Rooms list is incorrect"};
        res.write(JSON.stringify(data));
        res.end();
        return;
    }

    for (var i = 0; i<order.length; i++){
        Rooms.update({homeId :  data_obj.homeId , _id: order[i]},{$set: {position : i}});
    }
    res.write(JSON.stringify({ok: true}));
    res.end();
});