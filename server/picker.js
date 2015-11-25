/*global Picker Coords*/

Picker.route('/api/v1/coord/update', function(params, req, res, next) {
    var coord = params['query']["coord"];
    Coords.update({_id:"headset"}, {$set: {coord: coord}});
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ok: true}));
    res.end();
});
