function SingleTimelineGraph ( where, data, color, title ) {

  var width = $( where ).width(),
	  	height = $( where ).height();

  var data = data;

  var color = color;

	var margin = { top: height * 0.05 , right: width * 0.05 ,
               	   bottom: height * 0.06 , left: width * 0.05 };

	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

  var title = d3.select( where )
      .append( "div" )
      .style( "position", "absolute" )
      .style( "z-index", "0" )
      .style( "width", width * 2 / 3 ) 
      .style( "height", width / 40 )
      .style( "top", "0px")
      .style( "left", "0px" )
      .style( "font-size", "4vmin")
      .style( "pointer-events", "none" )
      .text( title );


	var x = d3.time.scale()
		.range( [ 0, width ] );

	var y = d3.scale.linear()
		.range( [ 0, height / 2 - height / 8 ] );

	var format = d3.time.format( "%Y" );
	  
	var stack = d3.layout.stack().offset( "zero" )
		.values( function ( d ) { return d.values; } )
		.x( function ( d ) { return d.date; } )
		.y( function ( d ) { return d.value; } );

	var strokecolor = "#000000";

	var area = d3.svg.area()
		.interpolate( "cardinal" )
		.x( function( d ) { return x( d.date ); } )
		.y0(function( d ) { return height / 2 + height / 15 - y( d.y ); } )
		.y1(function( d ) { return height / 2 + height / 15 + y( d.y ); } );

  	var layers0 = [ { key: data.key, values: data.values.map( function ( a ) {
	      	return { date: a.date, name: a.name, y: 0 , y0: 0 };
	    } ) } ];

	var layers = [ stack( data ) ];

	x.domain( d3.extent( data.values , function ( d ) { return d.date; } ) );

	y.domain( [ 0, d3.max( data.values, function ( d ) { return d.y; } ) ] );

	var svg = d3.select( where ).append( "svg" )
    	.attr( "width", width + margin.left + margin.right )
    	.attr( "height", height + margin.top + margin.bottom );

	var graph = svg.append( "g" )  
    	.attr( "transform", "translate(" + margin.left + "," + 0 + ")" );

	graph.selectAll( "path" )
    	.data( layers0 )
  .enter().append( "path" )
    	.attr( "d", function ( d ) {
      	return area( d.values );
    	} )
    	.attr( "class", "timeline-path" )
    	.attr( "id", function ( d ) {
      	return d.key + "-timeline-path";
    	} )
    	.style( "fill", color );

  	var datearray = [];

  	function mouseover ( d, i ) {
    
	    graph.selectAll( ".timeline-path" ).transition()
	    	.duration( 250 )
	    	.attr( "opacity", function ( d, j ) {
	       		return j != i ? 0.07 : 1;
	    } );
  	} 

  	function mousemove ( d, i ) {

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
	    .classed( "hover", true )
	    .attr( "stroke", strokecolor )
	    .attr( "stroke-width", "0.5px" );

	    if ( invertedx >= 40 && invertedx <= 99 ) {
	      invertedx = "19" + invertedx.toString();
	    } else {
	      invertedx = "20" + invertedx.toString();
	    }

    	tooltip.html( "<p>" + d.key + "<br>" + invertedx + "<br>" + pro + "</p>" ).style( "visibility", "visible" );
  	}

  	function mouseout ( d, i ) {

   		graph.selectAll( ".timeline-path" )
    	.transition()
	    .duration( 250 )
	    .attr( "opacity", "1" );
	    d3.select( this )
	    .classed( "hover", false )
    	tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style( "visibility", "hidden" );
  	}

  	var xAxis = d3.svg.axis()
    	.scale( x )
    	.orient( "bottom" )
    	.ticks( 10 )
    	.outerTickSize(0);
    
  	graph.append( "g" )
    	.attr( "class", "timeline-x-axis" )
      	.attr( "transform", "translate(0," + height + ")" )
      	.call( xAxis );

  	var tooltip = d3.select( where ) 
    	.append( "div" )
    	.attr( "class", "timeline-remove" )
    	.style( "position", "absolute" )
    	.style( "z-index", "20" )
    	.style( "visibility", "hidden" )
    	.style( "top", 0 + "px" )
    	.style( "left", 0 + "px" );

  	var vertical = d3.select( where )
      	.append( "div" )
      	.attr( "class", "timeline-remove" )
      	.style( "position", "absolute" )
      	.style( "z-index", "19" )
      	.style( "width", "1px" )
      	.style( "height", height + "px" )
      	.style( "top", "0px" )
      	.style( "bottom", "0px" )
      	.style( "left", "0px" )
      	.style( "background", "#fff" )
      	.style( "visibility", "hidden" );

    /*    
  	d3.select( where )
    	.on( "mousemove", function () {  
        	mousex = d3.mouse( this );
        	mousex = mousex[ 0 ] - 1;
        	vertical.style( "left", mousex + "px" ).style( "visibility", "visible" ); 
      	} )
      	.on( "mouseover", function () {  
        	mousex = d3.mouse( this );
        	mousex = mousex[ 0 ] - 1;
        	vertical.style( "left", mousex + "px" );
      	} )
      	.on( "mouseout", function () {
        	vertical.style( "visibility", "hidden" );
      	} );
    */

	function transition () {
		d3.selectAll( ".timeline-path" )
	        .data( function () {
	        	var t = layers;
	        	layers = layers0;
	        	return layers0 = t;
	        } )
        	// Disable hover during transition
        	.on( "mouseover", null ) 
        	.on( "mousemove", null )
        	.on( "mouseout", null )
      	.transition()
        	.duration( 1000 )
        	.attr( "d", function ( d ) { return area( d.values ); } )
        	.attr( "stroke", strokecolor )
	    	.attr( "stroke-width", "0.5px" )
      	.each( "end", function () {
        	// Re-enable hover
        	d3.selectAll( ".timeline-path" )
          	//.on( "mouseover", mouseover )
          	//.on( "mousemove", mousemove )
          	//.on( "mouseout", mouseout );
      	} );
  	}

  	this.remove = function () {
    	svg.remove();
    	graph.remove();
    	tooltip.remove();
    	vertical.remove();
      title.remove();
  	};

  	this.getColor = function () {
  		return color;
  	};

  	this.getData = function() {
  		return data;
  	};

    this.getKey = function() {
      return data.key;
    }

  	this.getPaths = function () {
    	return d3.selectAll( ".timeline-path" );
  	};

  	// Animate timeline
  	transition();

}