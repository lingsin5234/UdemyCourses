/*
*    donutChart.js
*    Mastering Data Visualization with D3.js
*    Final Project - Corporate Dashboard
*/

// Object Constructor
DonutChart2 = function(_parentElement, _variable, _donutData, _svgHeight, _svgWidth){
    this.parentElement = _parentElement;
    this.variable = _variable  // Y Variable
    this.donutData = _donutData
    this.svgHeight = _svgHeight
    this.svgWidth = _svgWidth

    this.initVis();
};

// initVis()
DonutChart2.prototype.initVis = function() {
    var vis = this;

    // dimensions
    vis.margin = { left:75, right:75, top:50, bottom:20 };
    vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;
    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
    vis.radius = Math.min(vis.width, vis.height) / 2;

    // this is where you get the parentElement - e.g. "#chart-area-proj-1"
    vis.svg3 = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    // remember pie/donut charts use the center as origin
    vis.g = vis.svg3.append("g")
        .attr("transform", "translate(" + (vis.width/2 + vis.margin.left) + " " + (vis.height/2 + vis.margin.top/2) + ")");

    // donut setup
	vis.pie = d3.pie()
		.padAngle(0.03)
		.value(function(d) { return d.data[vis.variable]; })
		.sort(null);

	vis.arc = d3.arc()
		.innerRadius(vis.radius - 60)
		.outerRadius(vis.radius - 30);

    // Graph Title
    vis.svg3.append("text")
        .attr("x", vis.width/2 + vis.margin.left)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .text(vis.variable == "market_cap" ?
        	"Market Capitalization" : "24 Hour Trading Volume")

    // next, call the wrangleData()
    vis.wrangleData();
}


// wrangleDate()
DonutChart2.prototype.wrangleData = function() {
    var vis = this;

    // get the active Coin selected
    vis.activeCoin = $("#coin-select-proj3-e2").val();

    vis.updateVis();
}


// updateVis()
DonutChart2.prototype.updateVis = function() {
    var vis = this;

    vis.path = vis.g.selectAll("path");

    vis.data0 = vis.path.data();
    vis.data1 = vis.pie(vis.donutData);

    // JOIN elements with new data.
    vis.path = vis.path.data(vis.data1, key);

    // EXIT old elements from the screen.
    vis.path.exit()
        .datum(function(d, i) { return findNeighborArc(i, vis.data1, vis.data0, key) || d; })
        .transition(transTime)
        .attrTween("d", arcTween)
        .remove();

    // UPDATE elements still on the screen.
    vis.path.transition(transTime)
        .attrTween("d", arcTween)
        .attr("fill-opacity", function(d) {
        	return (d.data.coin == vis.activeCoin) ? 1 : 0.3;
        }); // changing opacity for ACTIVE coin to full

    // ENTER new elements in the array.
    vis.path.enter()
        .append("path")
        .each(function(d, i) { this._current = findNeighborArc(i, vis.data0, vis.data1, key) || d; })
        .attr("fill", function(d) {  return colour(d.data.coin) })
        .attr("fill-opacity", function(d) {
        	return (d.data.coin == vis.activeCoin) ? 1 : 0.3;
        })
        .on("click", arcClicked)
        .transition(transTime)
            .attrTween("d", arcTween);

    // this will get the coin of the array
    function key(d){
        return d.data.coin;
    }

    // Adjust the preceding and following arcs' angles
	function findNeighborArc(i, data0, data1, key) {
	    var d;
	    return (d = findPreceding(i, vis.data0, vis.data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
	        : (d = findFollowing(i, vis.data0, vis.data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
	        : null;
	}

	// Find the element in data0 that joins the highest preceding element in data1.
	function findPreceding(i, data0, data1, key) {
	    var m = vis.data0.length;
	    while (--i >= 0) {
	        var k = key(vis.data1[i]);
	        for (var j = 0; j < m; ++j) {
	            if (key(vis.data0[j]) === k) return vis.data0[j];
	        }
	    }
	}

	// Find the element in data0 that joins the lowest following element in data1.
	function findFollowing(i, data0, data1, key) {
	    var n = vis.data1.length, m = vis.data0.length;
	    while (++i < n) {
	        var k = key(vis.data1[i]);
	        for (var j = 0; j < m; ++j) {
	            if (key(vis.data0[j]) === k) return vis.data0[j];
	        }
	    }
	}

    // Interpolate uses the normalization (0 to 1) for two values
    // this function determines what the new arc should be and used to draw the path
	function arcTween(d) {
	    var i = d3.interpolate(this._current, d);
	    this._current = i(1)
	    return function(t) { return vis.arc(i(t)); };
	}
}

