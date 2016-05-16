/*global Coords Spheres Homes Rooms */

if (Spheres.find().count() === 0) {

    var testSphereID1 = "5ff7bef11efaf8b657d709b9";
    var testSphere = {
        _id: testSphereID1,
        name: "virtuocity",
        sphereUrl: "https://www.dropbox.com/s/tzvc9t2otjhd3qt/nctech-iris360-prototype-sample02.jpg?dl=0",
        hud: '{"hud":false,"text":"Eye Control"}'
    }

    Spheres.insert(testSphere);
}

if (Coords.find().count() === 0) {

    var testCoordID1 = "headset";
    var testCoord = {
        _id: testCoordID1,
        coord: "0,0,1",
        timestamp: 0
    }
    var testCoordID2 = "headset2";
    var testCoord2 = {
        _id: testCoordID2,
        coord: "0,0,1",
        timestamp: 1
    }

    Coords.insert(testCoord);
    Coords.insert(testCoord2);
}

if (Homes.find().count() === 0) {
    Homes.insert({
        "_id" : "NccEh3y2YSkpH4a8j",
        "name" : "Buckingham Palace",
        "address" : "1800 King's Lane",
        "latitude" : "51.497740",
        "longitude" : "-0.191422",
        "propPic" : "https://www.dropbox.com/s/ifygb6e70kwrgbc/Terrace.jpg?dl=0",
        "slug" : "buckingham",
        "notes" : "Wonderful location, lots of light",
        "createdAt" : new Date(),
        "position" : 0,
        "numBedrooms" : 4,
        "numBathrooms" : 2,
        "price" : 1.9e+07,
        "year": 2014
    });

    Homes.insert({
        "_id" : "4W2gZnfppwBi99P87",
        "name" : "Westminster Abbey",
        "address" : "400 Queen's Road",
        "latitude" : "51.51740",
        "longitude" : "-0.01",
        "propPic" : "https://www.dropbox.com/s/x7deo1mv185x36c/20160413-003158.jpg?dl=0",
        "slug" : "westminster",
        "notes" : "Nice place to relax",
        "year" : "2015",
        "createdAt" : new Date(),
        "position" : 1,
        "numBedrooms" : 10,
        "numBathrooms" : 5,
        "price" : 1.4e+07
    });

    Rooms.insert({
        "name" : "Kitchen",
        "desc" : "It's awesome",
        "picUrl" : "https://www.dropbox.com/s/uthgx1tcr986jxp/Kitchen.jpg?dl=0",
        "homeId" : "NccEh3y2YSkpH4a8j",
        "createdAt" : new Date(),
        "position" : 0
    });

    Rooms.insert({
        "name" : "Master Bedroom",
        "desc" : "It's a bedroom",
        "picUrl" : "https://www.dropbox.com/s/lu7w2whang65z00/MasterBedroom.jpg?dl=0",
        "homeId" : "NccEh3y2YSkpH4a8j",
        "createdAt" : new Date(),
        "position" : 1
    })

    Rooms.insert({
        "name" : "Bedroom",
        "desc" : "Hello",
        "picUrl" : "https://www.dropbox.com/s/64p18xfzompfv26/20160503-093923.jpg?dl=0",
        "homeId" : "NccEh3y2YSkpH4a8j",
        "createdAt" : new Date(),
        "position" : 2
    });
}
