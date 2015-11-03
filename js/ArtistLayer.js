var ArtistLayer = L.Class.extend({

    initialize: function (latlng) {
        // save position of the layer or any options from the constructor
        this._latlng = latlng;
    },

    onAdd: function (map) {
        this._map = map;

        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');
        map.getPanes().overlayPane.appendChild(this._el);
        
        this.svg = d3.select(this._el).append("svg")
        // Find a way to get the size 
        this.svg.style("position","absolute").style("left","-25px").style("top","-25px").style("width","50px").style("height","50px").attr("viewBox","0 0 50 50")
		
		this.svg.append("circle").style("fill","#779ECB").attr("cx", 25)
        .attr("cy", 25)
        .attr("r", 25)
		
        // add a viewreset event listener for updating layer's position, do the latter
        map.on('viewreset', this._reset, this)
        this._reset();
    },

    onRemove: function (map) {
        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },

    _reset: function () {
        // update layer's position
        var pos = this._map.latLngToLayerPoint(this._latlng);
        L.DomUtil.setPosition(this._el, pos);
    }
});