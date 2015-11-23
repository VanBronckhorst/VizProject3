/**
 * Created by Filippo on 07/11/15.
 */
// Global for calling it in play song
var dm = new DataManager();

function init() {
    // Setting up the objects

    var fl = new ForceArtistDiagram("#compare-force");
    var fl2 = new ForceArtistDiagram("#explore-force");
    var listp1= new SelectedList("#compare-list-p1");
    var suggp1= new SuggestionList("#suggest-list-p1");
    var suggp2= new SuggestionList("#suggest-list-p2");
    var listp2= new SelectedList("#compare-list-p2");
    var m = new ArtistMap("#compare-map","dynamic");
    var m2 = new ArtistMap("#explore-map","static");
    var auto = new AutoCompleteBox("#autocomplete");
    var auto2 = new AutoCompleteBox("#autocomplete2");


    // Contains id's of selections
    var player1List = [];
    var player2List = [];

    var staticTimeline = new StaticTimeline( "#explore-timeline" );
    var dynamicTimeline = new DynamicTimeline( "#compare-timeline" );
    


    // functions for the autocomplete fields
    var selFunc1 = function(id){

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
    };

    var selFunc2 = function(id){

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
    };



    auto.searchFunc(function(d){if(d){
                dm.suggestArtist(d,function(err,data){if(!err){	//console.log(data);
                auto.showResults(data["artists"])} },5)
        }
        })
        .selectedFunc(selFunc1);
    auto2.searchFunc(function(d){if(d){
                dm.suggestArtist(d,function(err,data){if(!err){
                auto2.showResults(data["artists"])} },5)
        }
        })
        .selectedFunc(selFunc2);

    // functions for the artist/genre buttons
    var butt = new DoubleChoiceButton("#button-compare-p1","Artists","Genres");
    //var text = d3.select("#explore-header-p1");
    butt.onClick(function (i) {

        if (i==1) {

            //text.text("All Artists");
            auto.searchFunc(function(d){if(d){
                    dm.suggestArtist(d,function(err,data){if(!err){	//console.log(data);
                        auto.showResults(data["artists"])} },5)
                }
                })
                .selectedFunc(selFunc1);

        } else {
            //text.text("All Genres");
            auto.possibleResults(allGenresOnlyNames);
        }
    });

    var butt2 = new DoubleChoiceButton("#button-compare-p2","Artists","Genres");
    //var text2 = d3.select("#explore-header-p2");
    butt2.onClick(function (i) {
        if (i==1) {

            //text.text("All Artists");
            auto2.searchFunc(function(d){if(d){
                    dm.suggestArtist(d,function(err,data){if(!err){	//console.log(data);
                        auto2.showResults(data["artists"])} },5)
                }
                })
                .selectedFunc(selFunc2);

        } else {
            //text.text("All Genres");
            auto2.possibleResults(allGenresOnlyNames);
        }
    });



    // functions for the selected list
    var removerFunction = function(id,player) {
        m.removeArtist(id,player);
        fl.removeArtist({id:id},player);
        dynamicTimeline.removeArtist( id, player );
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




    // Population static map
    for (var i in topArtists) {

            m2.addArtist(topArtists[i]);
            fl2.addArtist(topArtists[i]);
    }

    // Highlighted content
    var highCont =d3.select("#highlight-content-p1").on("click",function() { m2.removeHighlight(1); highCont.text("")});
    var highCont2 =d3.select("#highlight-content-p2").on("click",function() { m2.removeHighlight(2); highCont2.text("")});
    // What to do when user press the artist/genre button in explore

    var autoStat = new AutoCompleteBox("#explore-autocomplete-p1");
    var autoStat2 = new AutoCompleteBox("#explore-autocomplete-p2");

    var highGenFunc1 = function(sel) {
        m2.highlightGenre(sel,1)
        highCont.text(sel);
    }
    var highGenFunc2 = function(sel) {
        m2.highlightGenre(sel,2)
        highCont2.text(sel);
    }
    var highArtFunc1 = function(sel) {

        m2.highlightArtist(sel,1)
        highCont.text(sel);
    }
    var highArtFunc2 = function(sel) {
        m2.highlightArtist(sel,2)
        highCont2.text(sel);
    }

    autoStat.possibleResults(topArtistsNames).selectedFunc(highArtFunc1);
    autoStat2.possibleResults(topArtistsNames).selectedFunc(highArtFunc2);


    var butt = new DoubleChoiceButton("#button-p1","Artists","Genres");
    var text = d3.select("#explore-header-p1");
    butt.onClick(function (i) {
        statList.reset();
        if (i==1) {
            for (var i in topArtistsNames)
            {
                var a = {name:topArtistsNames[i],id:i}
                statList.addArtist(a)

            }
            text.text("All Artists");
            autoStat.possibleResults(topArtistsNames)
                    .selectedFunc(highArtFunc1);

        } else {
            for (var i in topGenresNames)
            {
                statList.addGenre(topGenresNames[i]);

            }
            text.text("All Genres");
            autoStat.possibleResults(topGenresNames)
                .selectedFunc(highGenFunc1);
        }
    });

    var butt2 = new DoubleChoiceButton("#button-p2","Artists","Genres");
    var text2 = d3.select("#explore-header-p2");
    butt2.onClick(function (i) {
        statList2.reset();
        if (i==1) {
            for (var i in topArtistsNames)
            {
                var a = {name:topArtistsNames[i],id:i}
                statList2.addArtist(a)
            }
            text2.text("All Artists")
            autoStat2.possibleResults(topArtistsNames)
                .selectedFunc(highArtFunc2);;
        } else {
            for (var i in topGenresNames)
            {
                statList2.addGenre(topGenresNames[i]);
            }
            text2.text("All Genres")
            autoStat2.possibleResults(topGenresNames)
                .selectedFunc(highGenFunc2);;
        }
    });

    // Population of static lists
    var statList = new StaticList("#static-list-p1")
    var statList2 = new StaticList("#static-list-p2")
    for (var i in topArtistsNames)
    {
        var a = {name:topArtistsNames[i],id:i}
        statList.addArtist(a)
        statList2.addArtist(a)
    }
    statList.onClick(highArtFunc1);
    statList2.onClick(highArtFunc2);



    d3.selectAll(".expandible").classed("fullscreen", false).on("dblclick",expandibleClicked)

}