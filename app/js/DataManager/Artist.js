var defaultLocation = {
	"city": null,
    "country": null,
    "location": "Easter Island",
    "region": null
};

var Artist = function () {

	this.name;

	this.id;

	this.spotId;
	
	this.genres;

	this.popularity;

	this.albums;

	this.images;

	this.terms;

	this.location;

	this.popularityOverTime;

};

Artist.prototype.artistFromEchoJSON = function ( json ) {

	var art = json[ 'artist' ];

	this.name = art[ 'name' ];
	this.id = art[ 'id' ];
	this.spotId = art[ 'foreign_ids'] ? art[ 'foreign_ids' ][ 0 ][ 'foreign_id' ].split( ':' )[2] : null;
	this.genres = art[ 'genres' ];
	this.location = art[ 'artist_location' ] ? art[ 'artist_location' ] : defaultLocation;
	this.terms = art[ 'terms' ];
};

Artist.prototype.artistFromSpotifyJSON = function ( json ) {

	this.images = json[ "images" ];
};

Artist.prototype.albumsFromSpotifyJSON = function ( json ) {

	this.albums = [];
	for ( var a in json[ 'albums' ] ) {
		var album = new Album();
		album.albumFromSpotifyJSON( json[ 'albums' ][ a ] );
		this.albums.push( album );
	}
};

Artist.prototype.getPopularityOverTime = function () {
	
	if ( this.popularityOverTime ) {
		return this.popularityOverTime;
	}
	return this.popularityOverTime = this.computePopularity();
};

Artist.prototype.computePopularity = function () {
	
	var yearToPop = {};
	for ( var i = 0, len = this.albums.length; i < len; ++i ) {
		yearToPop[ this.albums[ i ].year ] = this.albums[ i ].popularity;
	}
	var popularity = [];
	for ( var i = 1910; i < 2016; ++i) {
		popularity[ i ] = yearToPop[ i ] || 0;
	}

	function smooth ( x ) {
		var sdsq = 2;
		// Change smoothing function for different shapes
		return Math.exp( -x * x / sdsq );
		// return Math.pow( x, alpha ) * Math.exp( -x * beta );
	}

	var smoothedPopularity = [];
	for ( var i in popularity ) {
		smoothedPopularity[ i ] = 0;
		for ( var j in popularity ) {
			smoothedPopularity[ i ] += popularity[ j ] * smooth( i - j );
		} 
	}
	return smoothedPopularity;
};