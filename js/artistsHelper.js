function areSimilar(a1,a2) {
	for (i in a1["genres"]) {
		var g = a1["genres"][i]["name"]
		for (j in a2["genres"]) {
			if (a2["genres"][j]["name"]==g){
				return true;
			}
		}
	}
/*
	for (i in a1["terms"]) {
		var g = a1["terms"][i]["name"]
		for (j in a2["terms"]) {
			if (a2["terms"][j]["name"]==g){
				return true;
			}
		}
	}
*/
	return false;
}

var geocoder = new google.maps.Geocoder();
function geocodeAddress(address,callback) {
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
       callback(results);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}