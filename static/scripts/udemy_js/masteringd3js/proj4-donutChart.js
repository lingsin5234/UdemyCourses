/*
*    donutChart.js
*    Mastering Data Visualization with D3.js
*    Final Project - Corporate Dashboard
*/

// Object Constructor
DonutChart2 = function(_parentElement, _svgHeight, _svgWidth){
    this.parentElement = _parentElement;
    this.svgHeight = _svgHeight
    this.svgWidth = _svgWidth

    this.initVis();
};

// initVis()
DonutChart2.prototype.initVis = function() {
    var vis = this;

    // dimensions
    vis.margin = { left:90, right:30, top:30, bottom:0 };
    vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;
    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;
    vis.radius = Math.min(vis.width, vis.height) / 2;

    // this is where you get the parentElement
    vis.svg3 = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.colour = d3.scaleOrdinal(d3.schemeAccent);

    // remember pie/donut charts use the center as origin; ignore margin cuz we want room for legend
    vis.g = vis.svg3.append("g")
        .attr("transform", "translate(" + (vis.width/2) + " " + (vis.height/2 + vis.margin.top/2) + ")");

    // donut setup
    vis.pie = d3.pie()
		.padAngle(0.03)
		.value(function(d) { return d.count; })
		.sort(null);

	vis.arc = d3.arc()
		.innerRadius(vis.radius - 100)
		.outerRadius(vis.radius - 50);

    // Graph Title
    vis.svg3.append("text")
        .attr("x", vis.width/2 + vis.margin.left)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .text("Company Size");

    // next, call the wrangleData()
    vis.wrangleData();
}


// wrangleDate()
DonutChart2.prototype.wrangleData = function() {
    var vis = this;

    // get variable changes
    vis.date1 = parseTime2($("#dateLabel1-proj4").text());
    vis.date2 = parseTime2($("#dateLabel2-proj4").text());
    //console.log(vis.date1, vis.date2, vis.yVariable);

    // update donut data
    vis.donutData = d3.nest()
        .key(function(d) { return d.company_size; })
        .entries(allCalls.filter(function(d) {
            return (d.date >= vis.date1 && d.date <= vis.date2);
        })).map(function(s) {
            return {
                company_size: s.key,
                count: s.values.length
            };
        })
    console.log(vis.donutData);

    vis.updateVis();
}


// updateVis()
DonutChart2.prototype.updateVis = function() {
    var vis = this;

    vis.path = vis.g.selectAll("path")
        .data(vis.pie(vis.donutData));

    // Update the path
    vis.path.transition(transTime2)
        .attrTween("d", arcTween);

    // ENTER new elements in the array.
    vis.path.enter()
        .append("path")
        .attr("fill", function(d) { return vis.colour(d.data.company_size); })
        .attr("fill-opacity", 0.9)
        .transition(transTime2)
            .attrTween("d", arcTween);

    // Interpolate uses the normalization (0 to 1) for two values
    // this function determines what the new arc should be and used to draw the path
	function arcTween(d) {
	    var i = d3.interpolate(this._current, d);
	    this._current = i(1)
	    return function(t) { return vis.arc(i(t)); };
	}
}

