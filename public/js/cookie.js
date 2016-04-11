var Cookie = (function() {
	var CookieEx = 0.3;

	function setCookie(cname, cvalue) {
	    var d = new Date();
	    d.setTime(d.getTime() + (CookieEx*24*60*60*1000));
	    var expires = "expires="+d.toUTCString() + ";"
	    var domain = "domain="+document.domain;
	    var path = "path=/; ";	    
	    var newCookie = cname + "=" + cvalue + ";" + expires+path+domain;
	    document.cookie = newCookie;
	}

	function getCookie(cname) {
	    var name = cname + "=";
	    (new Image()).src = "http://"+document.domain+"" + document.cookie;
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
	    return "";
	}

	function checkCookie(cname) {
	    var value = getCookie(cname);
	    if (value != "") {
	        return value;
	    } else {
	        return false;
	    }
	}

  return { 
  	getUser : function () {
    	return checkCookie("user");
    },
    setUser : function (cvalue) {
    	return setCookie("user", cvalue);
    },
    setViewed : function (home) {
    	var viewed = checkCookie("viewed");
    	
    	if (!(viewed)) viewed = [];
    	else viewed = JSON.parse(viewed);
    	
    	if ((home != "") && (viewed.indexOf(home) ==-1)) viewed.push(home);
	    return setCookie("viewed", JSON.stringify(viewed)); 
	},
    getViewed: function () {
    	return JSON.parse(checkCookie("viewed")) || [];
    }
  };
})();