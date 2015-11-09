var ArtistMap = function (where){
	var that=this;
	//INIT SECTION - Initiate the DIV for the map
	this.mapId = "map"+ parseInt(Math.random()*10000);
	this.mapDiv = d3.select(where).append("div").attr("id",this.mapId).attr("class","map-div");
	this.observers = [];
	this.artistMarkers = []

	this.addObserver = function(obs){
		this.observers.push(obs);
	}
	//TILES CREATION	
	
	
	this.pirateTile= L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'vanbronckhorst.nm2ecd0l',
	    accessToken: 'pk.eyJ1IjoidmFuYnJvbmNraG9yc3QiLCJhIjoiYjgyYTRhNjY0YzYxNDQ2ZWUzN2U5ZGFjNWFmMDI4OGYifQ.KUupQiTEuAkdC-WJgXZ7kA'
	})
	
 	this. geoTile =L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'vanbronckhorst.ncgpejmm',
	    accessToken: 'pk.eyJ1IjoidmFuYnJvbmNraG9yc3QiLCJhIjoiYjgyYTRhNjY0YzYxNDQ2ZWUzN2U5ZGFjNWFmMDI4OGYifQ.KUupQiTEuAkdC-WJgXZ7kA'
	})
	
	this.darkTile =L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'vanbronckhorst.nj9gh0od',
	    accessToken: 'pk.eyJ1IjoidmFuYnJvbmNraG9yc3QiLCJhIjoiYjgyYTRhNjY0YzYxNDQ2ZWUzN2U5ZGFjNWFmMDI4OGYifQ.KUupQiTEuAkdC-WJgXZ7kA'
	})
			
	this.tiles = [this.geoTile,this.darkTile]
	this.baseMaps = {
    "<g class = 'control-layer-text'>Geo Map</g>": this.geoTile,
    "<g class = 'control-layer-text'>Dark Map</g>": this.darkTile,
    "<g class = 'control-layer-text'>Pirates ;)</g>":this.pirateTile
	};	
	
	//INITIATE THE MAP	
	this.map = L.map(this.mapId,{layers: [this.darkTile],
								doubleClickZoom: false,
								markerZoomAnimation: false,
								scrollWheelZoom: 'center'
					}).setView([28.0, -50.0], 5);
	L.control.layers(this.baseMaps,null,{position:"topleft"}).addTo(this.map);

	this.mapDiv.on("click", function() {
											window.dispatchEvent(new Event('resize'));

											})


}

ArtistMap.prototype.addArtist= function(artist){
	var location = artist["artist_location"]["location"];
	var that = this;
	
	var callback = function(res) {
		var lat=res[0].geometry.location.lat();
		var lon = res[0].geometry.location.lng();
		that.addArtistMarker(artist,lat,lon);			
	};
	
	geocodeAddress(location,callback);

}

ArtistMap.prototype.removeArtist= function(id){
	for (var i in this.artistMarkers) {
		var m = this.artistMarkers[i];
		if (m.artistId == id) {
			this.map.removeLayer(m);
			this.artistMarkers.splice(i,1);
		}
	}
}

ArtistMap.prototype.addArtistMarker= function(artist,lat,lon){
	var marker	= new ArtistLayer([lat, lon],artist)
	this.artistMarkers.push(marker);
	//marker.options.title = artist.name;
	this.map.addLayer(marker);
}