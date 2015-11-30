function StaticTimeline ( where ) {
	
	var that = this;

	var artistsGraphTitle = "Top Artists";

	var genresGraphTitle = "Top Genres";

	var buttonsContainerId = "#explore-buttons-container";

	var artistsButtonId = "#explore-artists-button";

	var genresButtonId = "#explore-genres-button";

	var artistsGraph;

	var genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle );

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
		if ( highlightedArtistP1 || highlightedArtistP2 ) {
			that.highlightArtist();
		}
		
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

		if ( genresHelper && genresHelper.length != 0 ) {
				that.highlightArtist();
			}
	}


	$( where ).resize( function () {
		if ( genresGraph ) {
			genresGraph.remove();
			genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle );
			genresGraph.getPaths()
				.on( "click", onGenreClick );

			if ( genresHelper && genresHelper.length != 0 ) {
				that.highlightArtist();
			}

		}
		if ( artistsGraph ) {
			artistsGraph.remove();
			artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
			artistsGraph.getPaths()
				.on( "click", onArtistClick );
			if ( highlightedArtistP1 || highlightedArtistP2 ) {
				that.highlightArtist();
			}

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

	var highlightedArtistP1;

	var highlightedArtistP2;
	
	var highlightedGenreP1;

	var highlightedGenreP2;	

	var genresHelper;

	this.removeHighlightArtist = function ( player ) {

		if ( player == 1 ) {
			highlightedArtistP1 = null;
		} else if ( player == 2 ) {
			highlightedArtistP2 = null;
		}
		that.highlightArtist( null );

	}


	this.highlightArtist = function ( what, player ) {

		if ( what ) {
			if ( player == 1 ) {
				highlightedArtistP1 = what;
			} else if ( player == 2 ) {
				highlightedArtistP2 = what;
			}
		}

		if ( !( highlightedArtistP1 || highlightedArtistP2 ) ) {
			if ( artistsGraph ) {
				artistsGraph.remove();
				artistsGraph = new StaticStreamGraph( where, artistPopularity, artistsGraphTitle );
				artistsGraph.getPaths()
					.on( "click", onArtistClick );
			}
			genresHelper = [];

			if ( genresGraph ) {
				genresGraph.remove();
				genresGraph = new StaticStreamGraph( where, genresPopularity, genresGraphTitle );
				genresGraph.getPaths()
					.on( "click", onGenreClick );
			}

			return;
		}


		var genres = [];
		var count = 0;

		for ( var i in topArtists ) {
			var art = topArtists[ i ];
			if 	( art.name == highlightedArtistP1 || art.name == highlightedArtistP2 ) {
				for ( var j in art.genres ) {
					genres.push( art.genres[ j ].name.toLowerCase() );
				}
				count += 1;
			}
			if ( count > 1 ) {
				break;
			}
		}

		genresHelper = genres;


		if ( artistsGraph ) {
			var paths = artistsGraph.getPaths();

			paths
				.attr( "opacity", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key ) {
						return 1;
					}
					return 0.07;
				} )
				.attr( "stroke-width", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key ) {
						return "0.5px";
					}
				} )
				.attr( "stroke", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key ) {
						return "#000000";
					}
				} )
				.on( "mouseover", null )
				.on( "mousemove", highlightedMousemove )
				.on( "mouseout", highlightedMouseout )
				.on( "click", function ( d ) {
					if ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key ) {
						onArtistClick( d );
					}
					return null;
				} );

		} else if ( genresGraph ) {

			var paths = genresGraph.getPaths();

			paths
				.attr( "opacity", function ( d ) {
					if ( _.contains( genres, d.key.toLowerCase() ) ) {
						return 1;
					}
					return 0.07;
				} )
				.attr( "stroke-width", function ( d ) {
					if ( _.contains( genres, d.key.toLowerCase() ) ) {
						return "0.5px";
					}
				} )
				.attr( "stroke", function ( d ) {
					if ( _.contains( genres, d.key.toLowerCase() ) ) {
						return "#000000";
					}
				} )
				.on( "mouseover", null )
				.on( "mousemove", highlightedMousemove )
				.on( "mouseout", highlightedMouseout )
				.on( "click", function ( d ) {
					if ( _.contains( genres, d.key.toLowerCase() ) ) {
						onGenreClick( d );
					}
					return null;
				} );

		}

	}

	var datearray = [];

	function highlightedMousemove ( d, i ) {

		var tooltip;
		var x;

		if ( artistsGraph ) {
			tooltip = artistsGraph.tooltip;
			x = artistsGraph.x;
			if (  !( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key ) ) {
				return;
			}
		}
		if ( genresGraph ) {
			tooltip =  genresGraph.tooltip;
			x = genresGraph.x;
			if ( !_.contains( genresHelper, d.key.toLowerCase() ) ) {
				return;
			}
		}

	    mousex = d3.mouse( this );
	    mousex = mousex[ 0 ];
	    var invertedx = x.invert( mousex );
	    invertedx = invertedx.getYear();
	    var selected = ( d.values );
	    for ( var k = 0; k < selected.length; ++k ) {
	      datearray[ k ] = selected[ k ].date;
	      datearray[ k ] = datearray[ k ].getYear();
	    }

	    mousedate = datearray.indexOf( invertedx );

	    pro = Math.round( d.values[ mousedate ].value );

	    d3.select( this )
	    .classed( "hover", true );

	    invertedx = 1900 + invertedx;

	    tooltip.html( "<p>" + d.key + "<br>" + invertedx + "<br>" + pro + "</p>" ).style( "visibility", "visible" );
  	}

  	function highlightedMouseout ( d, i ) {

  		var tooltip;
  		var graph;

  		if ( artistsGraph ) {
  			tooltip = artistsGraph.tooltip;
  			graph = artistsGraph.getPaths();
  			if ( ! ( highlightedArtistP1 == d.key || highlightedArtistP2 == d.key ) ) {
				return;
			}
  		}
  		if ( genresGraph ) {
			tooltip =  genresGraph.tooltip;
			graph = genresGraph.getPaths();
			if ( !_.contains( genresHelper, d.key.toLowerCase() ) ) {
				return;
			}
		}

	   	graph.selectAll( ".static-timeline-path" )
	    	.transition()
	    	.duration( 250 )
	    	.attr( "opacity", "1" );
		d3.select( this )
	    	.classed( "hover", false )
	    	//.attr( "stroke-width", "0px" );

	    tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style( "visibility", "hidden" );
	}

}
