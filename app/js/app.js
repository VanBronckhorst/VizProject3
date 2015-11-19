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


    // Contains id's of selections
    var player1List = [];
    var player2List = [];

    var staticTimeline = new StaticTimeline( "#explore-timeline" );
    var dynamicTimeline = new DynamicTimeline( "#compare-timeline" );
    


    // functions for the autocomplete fields
    auto.searchFunc(function(d){if(d){
                dm.suggestArtist(d,function(err,data){if(!err){	//console.log(data);
                auto.showResults(data["artists"])} },5)
        }
        })
        .selectedFunc(function(id){

             if ( !_.contains( player1List, id ) ) {

                dm.artistFromId(id,function(err,data) {

                    listp1.addArtist(data);
                    suggp1.addArtist(data);
                    fl.addArtist(data,1);
                    m.addArtist(data,1)
                    dynamicTimeline.addArtist( data, 1 ); 
                } );

                player1List.push( id );

            }
        } );
    auto2.searchFunc(function(d){if(d){
            dm.suggestArtist(d,function(err,data){if(!err){	
                auto2.showResults(data["artists"])} },5)
        }
        })
        .selectedFunc(function(id){

            if ( !_.contains( player2List, id ) ) {

                dm.artistFromId(id,function(err,data){
                    console.log("added")
                    listp2.addArtist(data);
                    suggp2.addArtist(data);
                    fl.addArtist(data,2);
                    m.addArtist(data,2);
                    dynamicTimeline.addArtist( data, 2 );
                } );

                player2List.push( id );

            }
        } );

    // functions for the selected list
    var removerFunction = function(id,player) {
        m.removeArtist(id,player);
        fl.removeArtist({id:id},player);
    }

    listp1.onClick(function (id) {

        player1List = _.filter( player1List, function ( el ) { return el != id; } );

        removerFunction(id,1)
    });
    listp2.onClick(function (id) {

        player2List = _.filter( player2List, function ( el ) { return el != id; } );

        removerFunction(id,2)
    });

    // functions for the suggested list
    var adderFunction = function(artist,player) {
        dm.artistFromId(artist.id,function(err,data){
            var list = player==2?listp2:listp1;
            var sugg = player==2?suggp2:suggp1;

            list.addArtist(data);
            sugg.addArtist(data);
            fl.addArtist(data,player);
            m.addArtist(data,player);
            dynamicTimeline.addArtist( data, player );


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

    // Population of static lists
    var statList = new StaticList("#static-list-p1")
    var statList2 = new StaticList("#static-list-p2")
    for (var i in topArtistsNames)
    {
        var a = {name:topArtistsNames[i],id:i}
        statList.addArtist(a)
        statList2.addArtist(a)
    }

    var autoStat = new AutoCompleteBox("#explore-autocomplete-p1");
    var autoStat2 = new AutoCompleteBox("#explore-autocomplete-p2");

    autoStat.possibleResults(topArtistsNames);
    autoStat2.possibleResults(topArtistsNames);

    d3.selectAll(".expandible").classed("fullscreen", false).on("dblclick",expandibleClicked)

}