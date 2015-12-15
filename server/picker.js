/*global Picker Coords Homes Rooms Meteor */

var bodyParser = Meteor.npmRequire('body-parser');
var multiparty = Meteor.npmRequire('multiparty');
var util = Meteor.npmRequire('util');
var s3Client = new AWS.S3({
    accessKeyId: "AKIAIJGHG2GEWKQ3QBKA",
    secretAccessKey: "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"
});

Picker.route('/api/v1/coord/update', function(params, req, res, next) {
    var coord = params['query']["coord"];
    Coords.update({_id:"headset"}, {$set: {coord: coord}});
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ok: true}));
    res.end();
});

Picker.route('/api/v1/property', function(params, req, res, next) {
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
    res.write(JSON.stringify(data));
    res.end();
});

var postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
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
    form.on('part', function(part) {
        if (!part.filename) {
            // this is a field
            var key = part.name,
                value = '';
            part.on('readable',function() {
                var chunk = part.read();
                if (chunk != null) {
                    value += chunk;
                }
            });
            part.on('end',function(){
                data_obj[key] = value;
            });
            part.resume();
            return;
        }
        // this is a file
        if (!filename) {
            filename = part.filename;
        }
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
            insertRoom(data_obj, res);
        });
    });
    form.parse(req);
});

var insertRoom = Meteor.bindEnvironment(function(data_obj, res) {
    Rooms.insert({
        name: data_obj.name,
        desc: data_obj.description,
        picUrl: data_obj.picUrl,
        homeId: data_obj.homeId,
        createdAt: new Date()
    });
    res.write(JSON.stringify({ok: true}));
    res.end();
});
