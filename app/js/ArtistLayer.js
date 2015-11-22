var ArtistLayer = L.Class.extend({

    initialize: function (latlng,artist) {
        // save position of the layer or any options from the constructor
        this._latlng = latlng;
        this.artistId = artist.id;
        this.artist = artist;
    },

    onAdd: function (map) {
        this._map = map;

        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');
        map.getPanes().markerPane.appendChild(this._el);
        
        this.svg = d3.select(this._el).append("svg");

        var badLink= "http://userserve-ak.last.fm/";
        var avatar = null;
        for (i in this.artist.images){
            var url = this.artist.images[0]["url"];
            if (url.indexOf(badLink) == -1){
                avatar = url;
                break;
            }
        }
        this.defs = this.svg.append("defs");
        this.defs.append("svg:pattern")
            .attr("id", "map"+this.artistId)

            .attr("width", "100%")
            .attr("height", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("svg:image")
            .attr("xlink:href", avatar?avatar:defaultAvatar)
            .attr("width", 1)
            .attr("height", 1)
            .attr("preserveAspectRatio","none")

        // Find a way to get the size 
        this.svg.style("position","relative").style("left","-50px").style("top","-50px").style("width","100px").style("height","100px").attr("viewBox","0 0 100 100")
		
		this.svg.append("circle").style("fill","url(#map"+this.artistId+")").attr("cx", 50).attr("class","player1")
        .attr("cy", 50)
        .attr("r", 40)

        this.update();
        // add a viewreset event listener for updating layer's position, do the latter
        map.on('zoom viewreset', this.update, this);

    },

    onRemove: function (map) {
        // remove layer's DOM elements and listeners
        map.getPanes().markerPane.removeChild(this._el);
        map.off('zoom viewreset', this.update, this);
    },

    update: function () {
        // update layer's position
        var pos = this._map.latLngToLayerPoint(this._latlng);
        L.DomUtil.setPosition(this._el, pos);
    }
});