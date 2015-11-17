function DynamicTimeline ( where ) {
	
	var startingYear = 1940;

	var currentYear = 2015;

	var artistsGraphTitle = "Chosen Artists";

	var genresGraphTitle = "Chosen Genres";

	var buttonsContainerId = "#compare-buttons-container";

	var artistsButtonId = "#compare-artists-button";

	var genresButtonId = "#compare-genres-button";

	var artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );

	var genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );

	var initialTimeline = new StaticStreamGraph( where, [], "Chosen Artists / Genres Timeline" );

	var visualizedArtists = [];

	var visualizedGenres = [];

	var artistsTimelines = {}; // Maps artists to timelines { id: {...} }

	var genresTimelines = {};

	var artistsGraph;

	var artistsGraphParams = {};

	var genresGraph;

	var genresGraphParams = {};

	var singleArtistGraph;

	var singleGenreGraph;

	// Redraws the whole artists graph after clicking on the button
	function artistsClick() {
		if ( genresGraph ) {
			// Save the state of the graph before removing it
			genresGraphParams[ "data" ] = genresGraph.getData();
			genresGraphParams[ "start" ] = genresGraph.getStart();
			genresGraphParams[ "end" ] = genresGraph.getEnd();
			genresGraph.remove();
			genresGraph = null;
		}
		if ( singleArtistGraph ) {
			singleArtistGraph.remove();
			singleArtistGraph = null;
		}

		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );
		
		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", genresClick );

		// Draw new graph
		artistsGraph = new DynamicStreamGraph( where, artistsGraphParams[ "data" ] || [], artistsGraphTitle,
											   artistsGraphParams[ "start" ], artistsGraphParams[ "end" ] );
		// Enable click on artist
		artistsGraph.getPaths()
			.on( "click", onArtistClick );
	}

	// Redraws the whole genres graph after clicking on the button
	function genresClick() {
		if ( artistsGraph ) {
			// Save the state of the graph before removing it
			artistsGraphParams[ "data" ] = artistsGraph.getData();
			artistsGraphParams[ "start" ] = artistsGraph.getStart();
			artistsGraphParams[ "end" ] = artistsGraph.getEnd();
			artistsGraph.remove();
			artistsGraph = null;
		}
		if ( singleGenreGraph ) {
			singleGenreGraph.remove();
			singleGenreGraph = null;
		}

		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );
		
		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", artistsClick );

		// Draw new graph
		genresGraph = new DynamicStreamGraph( where, genresGraphParams[ "data" ] || [], genresGraphTitle,
											  genresGraphParams[ "start" ], genresGraphParams[ "end" ] );
		// Enable click on genre
		genresGraph.getPaths()
			.on( "click", onGenreClick );

	}

	// Add a new artist to the timeline
	this.addArtist = function ( artist, player ) {

		if ( singleArtistGraph ) {
			singleArtistGraph.remove();
			singleArtistGraph = null;
		}


		var artistTimeline;
		var color;
		if ( artistsTimelines[ artist.id ] ) {
			color = dynamicTimelineColorsMixed.shift();
			dynamicTimelineColorsMixed.push( color );
			artistTimeline = colorArtist( artist, color ); 
		} else {
			if ( player == 1 ) {
				color = dynamicTimelineColorsBlue.shift();
				dynamicTimelineColorsBlue.push( color );
				artistTimeline = colorArtist( artist, color);
			} else {
				color = dynamicTimelineColorsRed.shift();
				dynamicTimelineColorsRed.push( color );
				artistTimeline = colorArtist( artist, color);
			}
			visualizedArtists.push( artist );
		}

		artistsTimelines[ artist.id ] = artistTimeline;

		if ( genresGraph ) {
			genresGraph.remove();
			genresGraph = null;
		}
		if ( artistsGraph ) {
			artistsGraph.remove();
		}

		var minYear = currentYear;
		var maxYear = startingYear;

		for ( var i in visualizedArtists ) {
			if ( visualizedArtists[ i ].minActivityYear < minYear ) {
				minYear = visualizedArtists[ i ].minActivityYear;
			}
			if ( visualizedArtists[ i ].maxActivityYear > maxYear ) {
				maxYear = visualizedArtists[ i ].maxActivityYear;
			}
		}

		var what = [];
		for ( var i in artistsTimelines ) {
			what = what.concat( artistsTimelines[ i ] );
		}

		if ( initialTimeline ) {
			initialTimeline.remove();
			initialTimeline = null;
		}

		artistsGraph = new DynamicStreamGraph( where, what, artistsGraphTitle, minYear, maxYear );

		// Enable click on artist
		artistsGraph.getPaths()
			.on( "click", onArtistClick );

		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );
		
		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", genresClick );
	}


	function colorArtist ( artist, color ) {
		return artist.getPopularityOverTime().map( function ( d ) { 
			return { "name": d.name, "date": d.date, "value": d.value, "color": color };
		} );
	}

	$( where ).resize( function () {
		if ( initialTimeline ) {
			initialTimeline.remove();
			initialTimeline = new StaticStreamGraph( where, [], "Chosen Artists / Genres Timeline" );
		}
		if ( artistsGraph ) {
			artistsGraphParams[ "data" ] = artistsGraph.getData();
			artistsGraphParams[ "start" ] = artistsGraph.getStart();
			artistsGraphParams[ "end" ] = artistsGraph.getEnd();
			artistsGraph.remove();
			artistsGraph = new DynamicStreamGraph( where, artistsGraphParams[ "data" ] || [], artistsGraphTitle,
											   artistsGraphParams[ "start" ], artistsGraphParams[ "end" ] );
			// Enable click on artist
			artistsGraph.getPaths()
				.on( "click", onArtistClick );
		}
		if ( genresGraph ) {
			genresGraphParams[ "data" ] = genresGraph.getData();
			genresGraphParams[ "start" ] = genresGraph.getStart();
			genresGraphParams[ "end" ] = genresGraph.getEnd();
			genresGraph.remove();
			genresGraph = new DynamicStreamGraph( where, genresGraphParams[ "data" ] || [], genresGraphTitle,
											  genresGraphParams[ "start" ], genresGraphParams[ "end" ] );
			// Enable click on genre
			genresGraph.getPaths()
				.on( "click", onGenreClick );

		}
		if ( singleArtistGraph ) {
			var color = singleArtistGraph.getColor();
			var artistData = singleArtistGraph.getData();
			var title = singleArtistGraph.getKey();
			var start = singleArtistGraph.getStart();
			var end = singleArtistGraph.getEnd();
			singleArtistGraph.remove();
			singleArtistGraph = new SingleTimelineGraph( where, artistData, color, artistsGraphTitle + " - " + title, start, end );
		}
		if ( singleGenreGraph ) {
			var color = singleGenreGraph.getColor();
			var genreData = singleGenreGraph.getData();
			var title = singleGenreGraph.getKey();
			var start = singleGenreGraph.getStart();
			var end = singleGenreGraph.getEnd();
			singleGenreGraph.remove();
			singleGenreGraph = new SingleTimelineGraph( where, genreData, color, genresGraphTitle + " - " + title, start, end );
		}

	} );

	function onArtistClick ( d ) {
		var color = d.values[ 0 ].color;
		artistsGraphParams[ "data" ] = artistsGraph.getData();
		artistsGraphParams[ "start" ] = artistsGraph.getStart();
		artistsGraphParams[ "end" ] = artistsGraph.getEnd();
		artistsGraph.remove();
		artistsGraph = null;

		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", artistsClick );

		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );

		singleArtistGraph = new SingleTimelineGraph( where, d, color, artistsGraphTitle + " - " + d.key, 
												     artistsGraphParams[ "start" ], artistsGraphParams[ "end" ] );
	}


	function onGenreClick ( d ) {
		var color = d.values[ 0 ].color;
		genresGraphParams[ "data" ] = genresGraph.getData();
		genresGraphParams[ "start" ] = genresGraph.getStart();
		genresGraphParams[ "end" ] = genresGraph.getEnd();
		genresGraph.remove();
		genresGraph = null;

		genresButton.remove();
		genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" )
			.on( "click", genresClick );

		artistsButton.remove();
		artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" )

		singleGenreGraph = new SingleTimelineGraph( where, d, color, genresGraphTitle + " - " + d.key,
													genresGraphParams[ "start" ], genresGraphParams[ "end" ] );

	}

}