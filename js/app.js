/**
 * Created by Filippo on 07/11/15.
 */

function init() {
    // Setting up the objects
    var dm = new DataManager();
    var fl = new ForceArtistDiagram("#compare-force")
    var listp1= new SelectedList("#compare-list-p1");
    var suggp1= new SuggestionList("#suggest-list-p1");
    var suggp2= new SuggestionList("#suggest-list-p2");
    var listp2= new SelectedList("#compare-list-p2");
    var m = new ArtistMap("#compare-map")
    var m2 = new ArtistMap("#explore-map")
    var auto = new AutoCompleteBox("#autocomplete")
    var auto2 = new AutoCompleteBox("#autocomplete2")


    // functions for the autocomplete fields
    auto.searchFunc(function(d){if(d){
                dm.suggestArtist(d,function(err,data){if(!err){	//console.log(data);
                auto.showResults(data["artists"])} },5)
        }
        })
        .selectedFunc(function(id){
            dm.completeProfileFromId(id,function(err,data){
                listp1.addArtist(data["artist"]);
                suggp1.addArtist(data["artist"]);
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
                listp2.addArtist(data["artist"]);
                suggp2.addArtist(data["artist"]);
                fl.addArtist(data["artist"],2);
                m.addArtist(data["artist"],2);})
        });

    // functions for the selected list
    var removerFunction = function(id) {
        m.removeArtist(id);
    }

    listp1.onClick(removerFunction);
    listp2.onClick(removerFunction);

    // functions for the suggested list
    var adderFunction = function(artist,player) {
        dm.completeProfileFromId(artist["id"],function(err,data){
            var list = player==2?listp2:listp1;
            var sugg = player==2?suggp2:suggp1;

            list.addArtist(data["artist"]);
            sugg.addArtist(data["artist"]);
            fl.addArtist(data["artist"],player);
            m.addArtist(data["artist"],player);

        })
    }

    suggp1.onClick(function(artist) {adderFunction(artist,1) });
    suggp2.onClick(function(artist) {adderFunction(artist,2) });


    // Functions for the buttons that change the view

    var transitionDown= function() { d3.select("#main").transition().duration(2000).style("top","-100%")}
    var transitionUp= function() { d3.select("#main").transition().duration(2000).style("top","0")}

    d3.selectAll(".explore-switch-button").on("click",transitionDown)
    d3.selectAll(".compare-switch-button").on("click",transitionUp)


    // function to manage the expansion of the divs on the dbl click

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