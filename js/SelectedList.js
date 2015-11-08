
/**
 * Created by Filippo on 07/11/15.
 */

var SelectedList = function (where) {
    this.container = d3.select(where);
    this.listBox = this.container.append("div").attr("class","selected-list-box");
    this.nRows = 10;
    this.nCols = 1;
    this.elems = [];



}

SelectedList.prototype.rearrange = function() {
    for (var i in this.elems){
        var el = this.elems[i];
        var r = i
        var top = (r * (100/ this.nRows)) +"%";
        var h = (100/ this.nRows) +"%";
        var w = (100/ this.nCols) +"%";


        el.style("top",top).style("height",h).style("width",w)
    }
}

SelectedList.prototype.addArtist = function(artist) {
    var el = this.listBox.append("div").attr("class","selected-list-element")
    var newEl = new SelectedElement(el,artist["name"])
    this.elems.push(el);
    this.rearrange();
}

var SelectedElement = function(d3where,name) {
    this.container = d3where;

    //this.closeBox = this.container.append("i").attr("class","fa fa-close selected-close-box")
    this.textBox = this.container.append("p").attr("class","fa fa-close selected-text-box").text(name);
}