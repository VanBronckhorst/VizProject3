var defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Avatar_Picol_icon.svg/2000px-Avatar_Picol_icon.svg.png"

var ForceArtistDiagram = function (where) {
	var that= this;
	
	this.artists = [];
	this.config = {avatarSize:70};
	
	
	this.container = d3.select(where)
	
	this.svgW = 1000;
	this.svgH = 1000;
	this.padding = 1.5;
    
    this.maxRadius = this.config.avatarSize;
	
	this.svg = this.container.append("svg").style("width","100%").style("height","100%")	
							.attr("viewBox","0 0 "+this.svgW+" "+this.svgH);
	this.defs = this.svg.append("svg:defs");
	
    this.collide = function (alpha) {
	  var quadtree = d3.geom.quadtree(that.nodes);
	  return function(d) {
	    var r = d.radius + that.maxRadius + that.padding,
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
	        var x = d.x - quad.point.x,
	            y = d.y - quad.point.y,
	            l = Math.sqrt(x * x + y * y),
	            r = d.radius + quad.point.radius + that.padding;
	        if (l < r) {
	          l = (l - r) / l * alpha;
	          d.x -= x *= l;
	          d.y -= y *= l;
	          quad.point.x += x;
	          quad.point.y += y;
	        }
	      }
	      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	    });
	  }
	  };	
	

	this.tick = function(){
		that.link.attr("x1", function(d) { return d.source.x; })
		      .attr("y1", function(d) { return d.source.y; })
		      .attr("x2", function(d) { return d.target.x; })
		      .attr("y2", function(d) { return d.target.y; });
	
		that.node.each(that.collide(0.5))
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	
							
	this.force = d3.layout.force()
				.size([this.svgW, this.svgH])
			    .nodes(this.artists)
			    .linkDistance(this.config.avatarSize*2+this.padding)
			    .charge(-800)
			    .gravity(0.1)
			    .on("tick", this.tick)
			    .start();
			    
	this.nodes = this.force.nodes();
    this.links = this.force.links();
    this.node = this.svg.selectAll(".node");
    this.link = this.svg.selectAll(".link");
    

    
}

ForceArtistDiagram.prototype.restart = function () {
	var that = this;
	
	this.link = this.link.data(this.links);
	
	this.link.enter().insert("line", ".node")
	  .attr("class", "link");
	
	this.node = this.node.data(this.nodes);
	  
	
	this.node.enter().append("g")
		.attr("class", "node")
		.call(this.force.drag)
		.append("circle")
		.attr("class",function(d) { return d.player})
		.attr("fill", function(d) { return "url(#"+d.id+")"})
		.attr("cx", 0)
        .attr("cy", 0)
        .attr("r", this.config.avatarSize/2)

	
	this.force.start();
}

ForceArtistDiagram.prototype.addArtist = function(artist,p) {
	var artistNode = artist;
	
	
	this.defs.append("svg:pattern")
			.attr("id", artist.id)
			
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("patternContentUnits", "objectBoundingBox")
			.append("svg:image")
			.attr("xlink:href", artist["images"].length!=0?artist["images"][0]["url"]:defaultAvatar)
			.attr("width", 1)
			.attr("height", 1)
			.attr("preserveAspectRatio","none")
			
	
	
	artistNode.x = Math.random()*this.svgW;
	artistNode.y = Math.random()*this.svgH;
	artistNode.radius = this.config.avatarSize/2;
	artistNode.player = "player" + p;
	this.nodes.push(artistNode);
	
	for (var i in this.nodes){
		var a2 = this.nodes[i];
		if (areSimilar(a2,artist)){
			this.links.push({source:artistNode,target:a2})
		}
	}
	
	this.restart();
}




