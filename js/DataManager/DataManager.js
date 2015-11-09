var DataManager = function () {

	this.echoNestManager = new EchoNestManager();

	this.spotifyManager = new SpotifyManager();

	this.artistsObservers = [];

	this.genresObservers = [];

	this.chosenArtists = [];

	this.chosenGenres = [];

	this.searchedArtists = {}; // Cache to avoid queries over previously fetched artists


};

// Adds artists observer
DataManager.prototype.addArtistsObserver = function ( obj ) {
	
	console.log( 'Added new artists observer' );
	this.artistsObservers.push( obj );
};

// Adds genres observer
DataManager.prototype.addGenresObserver = function ( obj ) {
	
	console.log( 'Added new genres observer' );
	this.genresObservers.push( obj );
};

// Removes artists observer
DataManager.prototype.removeArtistsObserver = function ( obj ) {
	
	for( var i = 0, len = this.genresObservers.length; i < len; ++i ) {
  		if( this.artistsObservers[ i ] === obj ) {
    		this.artistsObservers.splice( i, 1 );
    		console.log( 'Removed existing artist observer' );
    		return true;
  		}
	}
return false;
};

// Removes genres observer
DataManager.prototype.removeGenresObserver = function ( obj ) {
	
	for( var i = 0, len = this.genresObservers.length; i < len; ++i ) {
  		if( this.genresObservers[ i ] === obj ) {
    		this.genresObservers.splice( i, 1 );
    		console.log( 'Removed existing genres observer' );
    		return true;
  		}
	}
return false;
};

// Retrieves the complete artist profile (including albums) 
DataManager.prototype.artistFromId = function ( id, callback ) {

	if ( this.searchedArtists[ id ] ) {
		console.log( 'Retrieve cached artist' );
		callback( null, this.searchedArtists[ id ] );
		return;
	}

	var artist = new Artist();

	var that = this;

	this.echoNestManager.completeProfileFromId( id )
	.then( function ( json ) { artist.artistFromEchoJSON( json ); } )
	.then( function () {
		that.spotifyManager.completeProfileFromId( artist.spotId )
		.then( function ( json ) { artist.artistFromSpotifyJSON( json ); } ); } )
		.then( function () {
			that.spotifyManager.albumIdsFromId( artist.spotId )
			.then( function ( json ) {
				var albumIds = [];
				for ( var i = 0, len = json[ 'items' ].length; i < len; ++i) {

					albumIds.push( json[ 'items' ][ i ][ 'id' ] ); 
				}
				that.spotifyManager.albumsFromIds( albumIds )
				.then( function ( json ) { artist.albumsFromSpotifyJSON( json ); } )
				.then( function () {
					that.chosenArtists.push( artist );
					// Cache artist
					that.searchedArtists[ artist.id ] = artist;
					callback( null, artist );
				} )
				.catch( function ( err ) {
					that.chosenArtists.push( artist );
					// Cache artist
					that.searchedArtists[ artist.id ] = artist;
					callback( null, artist );
				} );
			} );
		} );
};


DataManager.prototype.suggestArtist = function ( s, callback, n ) {

    this.echoNestManager.suggestArtist( s, callback, n );
};


DataManager.prototype.similarArtists = function ( artistsId, callback) {
    
    this.echoNestManager.similarArtists( artistsId, callback );
}