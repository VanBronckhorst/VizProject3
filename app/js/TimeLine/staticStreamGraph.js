function staticStreamGraph ( data, where ) { // data = [ [ { x: _, y: _ }, ... ], ... ]
  
  data = []

  data[0] = bumpLayer(2000);
  data[1] = bumpLayer(2000);
  data[2] = bumpLayer(2000);
  data[3] = bumpLayer(2000);
  data[4] = bumpLayer(2000);
  data[5] = bumpLayer(2000);

  var n = data.length, // number of layers 
      m = data[ 0 ].length; // number of samples per layer
      stack = d3.layout.stack().offset( "silhouette" ),
      layers0 = stack( d3.range( n ).map( function ( d ) { 
        return Array.apply( null, Array( m ) ).map( function ( d, i ) {
          return { x: i, y: 0 };
        } );
      } ) ),
      layers1 = stack( d3.range( n ).map( function ( d ) {
        return data[ d ];
      } ) );

  var width = $( "#" + where ).width(),
      height = $( "#" + where ).height();


  var tooltip = d3.select( "#" + where ) 
    .append( "div" )
    .attr( "class", where + ".remove" )
    .style( "position", "absolute" )
    .style( "z-index", "20" )
    .style( "visibility", "hidden" )
    .style( "top", "30px" )
    .style( "left", "55px" );


  var x = d3.scale.linear()
      .domain( [ 0, m - 1 ] )
      .range( [ 0, width ] );

  var y = d3.scale.linear()
      .domain( [ 0, d3.max( layers1 , function ( layer ) { 
        return d3.max( layer, function( d ) { 
          return d.y0 + d.y;
        } ); 
      } ) ] )
      .range( [ height, 0 ] );


  var yAxis = d3.svg.axis()
      .scale( y );

  var color = [ "#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6", // Blue 
               "#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6", // Pink
               "#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9" ];

  var strokecolor = "#000000";

  var area = d3.svg.area()
      .x( function( d ) { return x( d.x ); } )
      .y0(function( d ) { return y( d.y0 ); } )
      .y1(function( d ) { return y( d.y0 + d.y ); } );

  var svg = d3.select( "#" + where ).append( "svg" )
      .attr( "width", width )
      .attr( "height", height );

  svg.selectAll( "path" )
      .data( layers0 )
    .enter().append( "path" )
      .attr( "d", area )
      .attr( "id", where + "-path" )
      .style( "fill", function () { return color[ Math.round( Math.random() * color.length ) ]; } );

  // Animate timeline
  transition();

  // Highlight hovered layer
  svg.selectAll( "#" + where + "-path" )
    .attr( "opacity", 1 )
    .on( "mouseover", function (d, i) {
      svg.selectAll( "#" + where + "-path" ).transition()
      .duration( 250 )
      .attr( "opacity", function (d, j) {
        return j != i ? 0.6 : 1;
      } )
    } )
    .on("mousemove", function (d, i) {
      d3.select(this)
      .classed("hover", true)
      .attr("stroke", strokecolor)
      .attr("stroke-width", "0.5px");
    } )
    .on( "mouseout", function (d, i) {
     svg.selectAll( "#" + where + "-path" )
      .transition()
      .duration( 250 )
      .attr( "opacity", "1" );
      d3.select( this )
      .classed( "hover", false )
      .attr("stroke-width", "0px");
    } );


  // Need to fix axes
  svg.append( "g" )
      .attr( "class", where + ".y axis" )
      .attr( "transform", "translate(" + width + ", 0)" )
      .call( yAxis.orient( "right" ) );

  svg.append("g")
      .attr( "class", where + ".y axis" )
      .call( yAxis.orient( "left" ) );


  svg.on( "click", transition);

  function transition () {
    d3.selectAll( "#" + where + "-path" )
        .data( function () {
          var d = layers1;
          layers1 = layers0;
          return layers0 = d;
        } )
      .transition()
        .duration( 2500 )
        .attr( "d", area );
  }

  // Inspired by Lee Byron's test data generator.
  function bumpLayer(n) {

    function bump(a) {
      var x = 1 / (.1 + Math.random()),
          y = 2 * Math.random() - .5,
          z = 10 / (.1 + Math.random());
      for (var i = 0; i < n; i++) {
        var w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }

    var a = [], i;
   
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < 10; ++i) bump(a);
    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
  }
}

