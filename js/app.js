/**
 * Created by Filippo on 07/11/15.
 */

function init() {
    var dm = new DataManager();
    var fl = new ForceArtistDiagram("#compare-force")
    var listp1= new SelectedList("#compare-list-p1");
    var listp2= new SelectedList("#compare-list-p2");

    var m = new ArtistMap("#compare-map")
    var m2 = new ArtistMap("#explore-map")
    var auto = new AutoCompleteBox("#autocomplete")
    var auto2 = new AutoCompleteBox("#autocomplete2")
    auto.searchFunc(function(d){if(d){
            dm.suggestArtist(d,function(err,data){if(!err){	//console.log(data);
                auto.showResults(data["artists"])} },5)
        }
        })
        .selectedFunc(function(id){
            dm.completeProfileFromId(id,function(err,data){
                listp1.addArtist(data["artist"])
                fl.addArtist(data["artist"],1);
                m.addArtist(data["artist"],1);})
        });
    auto2.searchFunc(function(d){if(d){
            dm.suggestArtist(d,function(err,data){if(!err){	//console.log(data);
                auto2.showResults(data["artists"])} },5)
        }
        })
        .selectedFunc(function(id){
            dm.completeProfileFromId(id,function(err,data){
                listp2.addArtist(data["artist"])
                fl.addArtist(data["artist"],2);
                m.addArtist(data["artist"],2);})
        });
    var transitionDown= function() { d3.select("#main").transition().duration(2000).style("top","-100%")}
    var transitionUp= function() { d3.select("#main").transition().duration(2000).style("top","0")}

    d3.selectAll(".explore-switch-button").on("click",transitionDown)
    d3.selectAll(".compare-switch-button").on("click",transitionUp)


    var expandibleClicked = function () {
        var d3el = d3.select(this);
        if (d3el.classed("fullscreen") == false) {
            d3.selectAll(".fullscreen").classed("fullscreen", true)
            d3el.classed("fullscreen", true)

        } else {
            d3el.classed("fullscreen", false)
        }
    }

    d3.selectAll(".expandible").classed("fullscreen", false).on("dblclick",expandibleClicked)

}