/*global Coords Spheres */

if (Spheres.find().count() === 0) {

    var testSphereID1 = "5ff7bef11efaf8b657d709b9";
    var testSphere = {
        _id: testSphereID1,
        name: "virtuocity",
        sphereUrl: "https://www.dropbox.com/s/tzvc9t2otjhd3qt/nctech-iris360-prototype-sample02.jpg?dl=0"
    }

    Spheres.insert(testSphere);
}

if (Coords.find().count() === 0) {

    var testCoordID1 = "headset";
    var testCoord = {
        _id: testCoordID1,
        coord: "0,0,1"
    }

    Coords.insert(testSphere);
}
