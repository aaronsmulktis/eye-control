var black = ["localhost","foxtons","eye-control-test"];

var Skins = {


	getPin : function(host){
		//Is a simple HARCODE service, when the service grow this code need refactorize
		if (black.indexOf(host) != -1)
			return "map-pin-black.png"
		else
			return "map-pin.png"
	},
	getMapStyle : function(host){
		//Is a simple HARCODE service, when the service grow this code need refactorize
		if (black.indexOf(host) != -1)
			return {stylers: [{ hue: "#0A6F5F" } ] };
		else return null;
	}
};

console.log(Skins.getPin("localhost"));