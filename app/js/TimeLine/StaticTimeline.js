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

	var artistsButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", artistsButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-active" );

	artistsButton.on( "click", artistsClick );

	var genresButton = d3.select( buttonsContainerId ).append( "div" )
			.attr( "id", genresButtonId.slice(1) )
			.attr( "class", "pure-button" )
			.attr( "class", "pure-button-disabled" );

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
		artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
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
		genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle ); // TODO change with genrePopularity when ready
			
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

		singleArtistGraph = new SingleTimelineGraph( where, d, color, artistsGraphTitle + " - " + d.key );
	}

	function onGenreClick ( d ) {
		var color = d.values[ 0 ].color;
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

		singleGenreGraph = new SingleTimelineGraph( where, d, color, genresGraphTitle + " - " + d.key );

	}

	// If called with no parameter disable highlight
	// Else highlight given parameter
	this.highlight = function ( what ) {
		if ( !what ) {
			noHighlight();
			return;
		}
		highlightArtist(name)
	}

	function highlightArtist ( name ) {
		if ( artistsGraph ) {
			artistsGraph.getPaths().transition()
      			.duration( 250 )
      			.attr( "opacity", function ( d, i ) {
        			return d.key != name ? 0.07 : 1;
      			} );
		} else if ( genresGraph ) {
			genresGraph.getPaths().transition()
				.duration( 250 )
				.attr( "opacity", function ( d, i ) { 
					return _.contains( d.values[ 0 ].artists, name ) ? 1 : 0.07; // Imagine genres has a list of artists playing that genre
				} );
		}
	}

	function highlightGenre ( name ) {
		if ( genresGraph ) {
			genresGraph.getPaths().transition()
      			.duration( 250 )
      			.attr( "opacity", function ( d, i ) {
        			return d.key != name ? 0.07 : 1;
      			} );
		} else if ( artistsGraph ) {
			artistsGraph.getPaths().transition()
				.duration( 250 )
				.attr( "opacity", function ( d, i ) { 
					return _.contains( d.values[ 0 ].genres, name ) ? 1 : 0.07; // Imagine artists has a list of genres he plays
				} );
		}
	}

	function noHighlight () {
		if ( artistsGraph ) {
			artistsGraph.getPaths().transition()
      			.duration( 250 )
      			.attr( "opacity", 1 );
		}
		if ( genresGraph ) {
			genresGraph.getPaths().transition()
      			.duration( 250 )
      			.attr( "opacity", 1 );
		}
	}
}
