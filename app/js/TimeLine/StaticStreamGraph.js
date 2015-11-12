function StaticStreamGraph ( data, where ) { // data = [ [ { x: _, y: _ }, ... ], ... ]
    
  var width = $( "#" + where ).width(),
      height = $( "#" + where ).height();

  var x = d3.time.scale()
      .range( [ 0, width ] );

  var y = d3.scale.linear()
      .range( [ height, 0 ] );

  var n = data.length, // number of layers 
      m = data[ 0 ].length, // number of samples per layer
      
      format = d3.time.format( "%m/%d/%Y" ),
      
      stack = d3.layout.stack().offset( "silhouette" )
      .values( function ( d ) { return d.values; } )
      .x( function ( d ) { return d.date; } )
      .y( function ( d ) { return d.value; } );

  var nest = d3.nest()
      .key( function ( d ) { return d.name; } );

  var color = [ "#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6",
                "#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1C9F0",
                "#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9",
                "#00A8E8", "#007EA7", "#003459" ];

  var strokecolor = "#000000";

  data.forEach( function ( d, i ) {

    if ( typeof d.date === "string" ) {
      d.date = format.parse( d.date )
    }
    d.value = +d.value;
  } );

  var area = d3.svg.area()
      .interpolate( "cardinal" )
      .x( function( d ) { return x( d.date ); } )
      .y0(function( d ) { return y( d.y0 ); } )
      .y1(function( d ) { return y( d.y0 + d.y ); } );

  var layers0 = stack( nest.entries( data.map( function ( d ) {
    return { name: d.name, date: d.date, value: 0 };
  } ) ));

  layers0 = layers0.map( function ( d ) {
    return { key: d.key, values: d.values.map( function ( a ) {
      return { date: a.date, name: a.name, y: height / 2, y0: height / 2 };
    } ) };
  } );

  var layers = stack( nest.entries( data ) );

  x.domain( d3.extent( data, function ( d ) { return d.date; } ) );

  y.domain( [ 0, d3.max( data, function ( d ) { return d.y0 + d.y; } ) ] );

  var svg = d3.select( "#" + where ).append( "svg" )
      .attr( "width", width )
      .attr( "height", height );

  svg.selectAll( "path" )
      .data( layers0 )
    .enter().append( "path" )
      .attr( "d", function ( d ) {
        return area( d.values );
      } )
      .attr( "id", where + "-path" )
      .style( "fill", function () { return color[  Math.round( Math.random() * ( color.length - 1 ) ) ]; } );

  // Animate timeline
  transition();

  var datearray = [];

  // Highlight hovered layer
  svg.selectAll( "#" + where + "-path" )
    .attr( "opacity", 1 )
    .on( "mouseover", function (d, i) {
      
      svg.selectAll( "#" + where + "-path" ).transition()
      .duration( 250 )
      .attr( "opacity", function (d, j) {
        return j != i ? 0.05 : 1;
      } )
    } )
    
    .on( "mousemove" , function (d, i) {

      mousex = d3.mouse( this );
      mousex = mousex[ 0 ];
      var invertedx = x.invert( mousex );
      invertedx = invertedx.getYear();
      var selected = ( d.values );
      for ( var k = 0; k < selected.length; ++k ) {
        datearray[ k ] = selected[ k ].date
        datearray[ k ] = datearray[ k ].getYear();
      }

      mousedate = datearray.indexOf( invertedx );

      pro = d.values[ mousedate ].value;

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
    } )
    .on( "mouseout", function (d, i) {
      
      svg.selectAll( "#" + where + "-path" )
      .transition()
      .duration( 250 )
      .attr( "opacity", "1" );
      d3.select( this )
      .classed( "hover", false )
      .attr( "stroke-width", "0px" );

      tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style( "visibility", "hidden" );

    } );
    
  var yAxis = d3.svg.axis()
      .scale( y );

  // Need to fix axes
  svg.append( "g" )
      .attr( "class", where + ".y axis" )
      .attr( "transform", "translate(" + width + ", 0)" )
      .call( yAxis.orient( "right" ) );

  svg.append("g")
      .attr( "class", where + ".y axis" )
      .call( yAxis.orient( "left" ) );


  var tooltip = d3.select( "#" + where ) 
    .append( "div" )
    .attr( "class", where + ".remove" )
    .style( "position", "absolute" )
    .style( "z-index", "20" )
    .style( "visibility", "hidden" )
    .style( "top", height / 40 + "px" )
    .style( "left", width / 20 + "px" );

  var vertical = d3.select( "#" + where )
      .append( "div" )
      .attr( "class", where + ".remove" )
      .style( "position", "absolute" )
      .style( "z-index", "19" )
      .style( "width", "1px" )
      .style( "height", height + "px" )
      .style( "top", "0px" )
      .style( "bottom", "0px" )
      .style( "left", "0px" )
      .style( "background", "#fff" )
      .style( "visibility", "hidden" );

  d3.select( "#" + where )
      .on( "mousemove", function () {  
        mousex = d3.mouse( this );
        mousex = mousex[ 0 ] + 5;
        vertical.style( "left", mousex + "px" ).style( "visibility", "visible" ); 
      } )
      .on( "mouseover", function () {  
        mousex = d3.mouse( this );
        mousex = mousex[ 0 ] + 5;
        vertical.style( "left", mousex + "px" )
      } )
      .on( "mouseout", function () {
        vertical.style( "visibility", "hidden" );
      });


  function transition () {
    d3.selectAll( "#" + where + "-path" )
        .data( function () {
          var t = layers;
          layers = layers0;
          return layers0 = t;
        } )
      .transition()
        .duration( 2500 )
        .ease("elastic")
        .attr( "d", function ( d ) {
          return area( d.values );
        } );
  }

  this.svg = svg;

  this.tooltip = tooltip;

  this.vertical = vertical;

}

StaticStreamGraph.prototype.remove = function () {
  this.svg.remove();
  this.tooltip.remove();
  this.vertical.remove();
};
