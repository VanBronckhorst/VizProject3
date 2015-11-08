function getPx(s,Attr) {
	if (s[s.length-1]=="%"){
		return parseInt(d3.select("body").style(Attr)) * (parseFloat(s)/100)
	} else {
		return parseInt(s)
	}
}



var AutoCompleteBox = function(where) {
	var that = this;
	
	this._searchFunc = function(d) {
		console.log("Searching")
		console.log(d);
	}
	
	
	this._searchFuncCaller = function() {
		var res = that._searchFunc(that.inputBox.node().value);
		that.showResults([])
	}
	this.container =  d3.select(where);


	//this.container.append("span").attr("class","fa fa-search search-box-icon")
	this.inputBox = this.container.append("input").attr("id","autoCompleteBox").attr("class","autocomplete-input").on("keyup",this._searchFuncCaller).attr("placeholder","Search...");
	this.inputW = parseInt(this.inputBox.style("width"));
	this.inputH = parseInt(this.inputBox.style("height"));

	this.w = this.inputBox.style("width");
	this.left = (this.inputBox.style("left"));
	this.top = (this.inputBox.style("height"));

	this.resultsBox = this.container.append("div").attr("class","sugg-results-box").style("width",this.inputW+"px").style("height",parseInt(d3.select("body").style("height"))*0.2+"px")
						.style("position","absolute").style("left",this.left).style("top","63px")
						.style("display","none")
	
}

AutoCompleteBox.prototype.searchFunc = function(func){
	this._searchFunc = func;
	return this;
}

AutoCompleteBox.prototype.showResults = function(res){
	var that = this;

	this.w = this.inputBox.style("width");
	this.left = (this.inputBox.style("left"));
	this.top = (this.inputBox.style("top"));
	this.inputW = getPx(this.inputBox.style("width"),"width");
	this.inputH = getPx(this.inputBox.style("height"),"height");
	
	//TODO Change height
	this.resultsBox.style("width",this.inputW+"px").style("height",parseInt(d3.select("body").style("height"))*0.4+"px")
					.style("position","absolute").style("left",this.left+"px").style("top",(this.top+this.inputH)+"px")
					.style("display",res.length==0?"none":"block")
	
	this.resultsBox.selectAll("*").remove()				
	
	for (var i in res) {
		var r = res[i]
		var resDiv=this.resultsBox.append("div").attr("class","sugg-result-div").text(r["name"]);
		resDiv.attr("tag",r["id"]);
		resDiv.on("click",function(){	that.inputBox.node().value = d3.select(this).text();
										that.showResults([]);
										that._selectedFunc(d3.select(this).attr("tag"))})
	}
	
}

AutoCompleteBox.prototype.selectedFunc = function(func){
	this._selectedFunc = func;
	return this;
}

