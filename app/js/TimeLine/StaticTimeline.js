function StaticTimeline ( where ) {
	
	var artistsGraphTitle = "Top Artists";

	var genresGraphTitle = "Top Genres";

	var buttonsContainerId = "#explore-buttons-container";

	var artistsButtonId = "#explore-artists-button";

	var genresButtonId = "#explore-genres-button";

	var artistsGraph;
	
	var genresGraph = new StaticStreamGraph( where, artistPopularity, genresGraphTitle );

	genresGraph.getPaths()
		.on( "click", onGenreClick );

	var singleArtistGraph;

	var singleGenreGraph; 

	var artistsButton = d3.select( buttonsContainerId ).append( "div" ).attr( "id", artistsButtonId.slice(1) );

	artistsButton.on( "click", artistsClick );

	var genresButton;

	var nest = d3.nest().key( function ( d ) { return d.name; } );

	function artistsClick () {
		// Remove existing graphs and buttons
		if ( genresGraph ) {
			genresGraph.remove();
			genresGraph = null;
		}
		if ( singleArtistGraph ) {
			singleArtistGraph.remove();
			singleArtistGraph = null;
		}
		if ( singleGenreGraph ) {
			singleGenreGraph.remove();
			singleGenreGraph = null
		}
		if ( artistsButton ) {
			artistsButton.remove();
			artistsButton = null;
		}
		// Redraw genres button if missing
		if ( !genresButton ) {
			genresButton = d3.select( buttonsContainerId ).append( "div" )
					.attr( "id", genresButtonId.slice(1) );
		}
		// Draw new graph
		artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
		// Show and enable buttons
		genresButton
			.attr( "visibility", "visible")
			.on( "click", genresClick );
		// Enable click on artist
		artistsGraph.getPaths()
			.on( "click", onArtistClick );

	} 

	function genresClick () {
		// Remove existing graphs and buttons
		if ( artistsGraph ) {
			artistsGraph.remove();
			artistsGraph = null;
		}
		if ( singleGenreGraph ) {
			singleGenreGraph.remove();
			singleGenreGraph = null;
		}
		if ( singleArtistGraph ) {
			singleArtistGraph.remove();
			singleArtistGraph = null;
		}
		if ( genresButton ) {
			genresButton.remove();
			genresButton = null;
		}
		// Redraw genres button if missing
		if ( !artistsButton ) {
			artistsButton = d3.select( buttonsContainerId ).append( "div" )
					.attr( "id", artistsButtonId.slice(1) );
		}
		// Draw new graph
		genresGraph = new StaticStreamGraph( where, artistPopularity, genresGraphTitle ); // TODO change with genrePopularity when ready
		// Show and enable buttons 
		artistsButton
			.attr( "visibility", "visible")
			.on( "click", artistsClick );
		// Enable click on artist
		genresGraph.getPaths()
			.on( "click", onGenreClick );
	}


	$( where ).resize( function () {
		if ( genresGraph ) {
			genresGraph.remove();
			genresGraph = new StaticStreamGraph( where, artistPopularity, genresGraphTitle );
			genresGraph.getPaths()
				.on( "click", onGenreClick );

		}
		if ( artistsGraph ) {
			artistsGraph.remove();
			artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
			artistsGraph.getPaths()
				.on( "click", onArtistClick );

		}
		if ( singleArtistGraph ) {
			var color = singleArtistGraph.getColor();
			var artistData = singleArtistGraph.getData();
			var title = singleArtistGraph.getKey();
			singleArtistGraph.remove();
			singleArtistGraph = new SingleTimelineGraph( where, artistData, color, artistsGraphTitle + " - " + title );
		}
		if ( singleGenreGraph ) {
			var color = singleGenreGraph.getColor();
			var genreData = singleGenreGraph.getData();
			var title = singleGenreGraph.getKey();
			singleGenreGraph.remove();
			singleGenreGraph = new SingleTimelineGraph( where, genreData, color, genresGraphTitle + " - " + title );
		}
    } );

	function onArtistClick ( d ) {
		var color = d.values[ 0 ].color;
		artistsGraph.remove();
		artistsGraph = null;
		if ( !artistsButton ) {
			artistsButton = d3.select( buttonsContainerId ).append( "div" )
					.attr( "id", artistsButtonId.slice(1) );
		}
		artistsButton
			.on( "click", artistsClick );
		genresButton.remove();
		genresButton = null;
		singleArtistGraph = new SingleTimelineGraph( where, d, color, artistsGraphTitle + " - " + d.key );
	}


	function onGenreClick ( d ) {
		var color = d.values[ 0 ].color;
		genresGraph.remove();
		genresGraph = null;
		if ( !genresButton ) {
			genresButton = d3.select( buttonsContainerId ).append( "div" )
					.attr( "id", genresButtonId.slice(1) );
		}
		genresButton
			.on( "click", genresClick );
		artistsButton.remove();
		artistsButton = null;
		singleGenreGraph = new SingleTimelineGraph( where, d, color, genresGraphTitle + " - " + d.key );

	}
}