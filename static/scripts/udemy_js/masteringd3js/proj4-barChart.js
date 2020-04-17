/*
*    donutChart.js
*    Mastering Data Visualization with D3.js
*    Final Project - Corporate Dashboard
*/

// constructor function
BarChart = function(_parentElement, _svgHeight, _svgWidth, _yVariable) {
    this.parentElement = _parentElement;
    this.svgHeight = _svgHeight;
    this.svgWidth = _svgWidth;
    this.yVariable = _yVariable;

    this.initVis();
}

// initialize
BarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 25, bottom: 75, left: 90, right: 30}
    vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom
    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right

    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + " " + vis.margin.top + ")");

    // capitalize First Letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // X Axis
    vis.x = d3.scaleBand()
        .range([0, vis.width])
        .domain(["electronics", "furniture", "appliances", "materials"])
        .paddingInner(0.3)
        .paddingOuter(0.3);
    vis.xAxisCall = d3.axisBottom()
        .tickFormat(function(d) {
            return "" + capitalizeFirstLetter(d);
        });
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + " " + vis.height + ")");

    // Y Axis
    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);
    vis.yAxisCall = d3.axisLeft()
        .ticks(4);
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0 0)");

    // add X-axis label
    /*vis.xAxisLabel = vis.g.append("text")
        .attr("transform", "translate(" + (vis.width/2 - vis.margin.right) + " " + (vis.height + vis.margin.bottom/2) + ")")
        .attr("text-anchor", "start")
        .attr("font-size", "1.2em")
        .text("Category");

    // add Y-axis label
    vis.yAxisLabel = vis.g.append("text")
        .attr("transform", "translate(" + -(vis.margin.right * 2) + " " + (vis.height/2 + vis.margin.top) + ") rotate(-90)")
        .attr("text-anchor", "start")
        .attr("font-size", "1.2em");*/

    // Add a Title
    vis.g.append("text")
        .attr("transform", "translate(" + vis.width/2 + " -10)")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .text(vis.yVariable == "units_sold" ? "Units Sold" :
            vis.yVariable == "call_revenue" ? "Call Revenue" : "Call Duration");

    vis.wrangleData();
}

// wrangleData
BarChart.prototype.wrangleData = function() {
    var vis = this;

    // grab updates
    vis.date1 = parseTime2($("#dateLabel1-proj4").text());
    vis.date2 = parseTime2($("#dateLabel2-proj4").text());
    // vis.yVariable = $("#var-select-proj4").val();

    // get updated data, map by category and AVERAGE
    vis.data = d3.nest()
        .key(function(d){
            return d.category;
        })
        .entries(allCalls.filter(function(d) {
            return (d.date >= vis.date1 && d.date <= vis.date2);
        })).map(function(d){
            return {
                category: d.key,
                // reduce takes all the values from the day Object, values and SUMs upon return
                sum: d.values.reduce(function(accumulator, current){
                    return accumulator + current[vis.yVariable]
                }, 0),
                // count
                count: d.values.length
            }
        });
    //console.log(vis.data);

    vis.updateVis();
}

// updateVis
BarChart.prototype.updateVis = function() {
    var vis = this;

    // Set Domains and Axes
    //console.log(vis.data.map(function(d) { return d.category; }));
    //console.log(d3.max(vis.data, function(d) { return d.sum / d.count; }));
    //vis.x.domain(vis.data.map(function(d) { return d.category; }))
    vis.y.domain([0, d3.max(vis.data, function(d) { return d.sum / d.count; }) * 1.005])

    vis.xAxis.call(vis.xAxisCall.scale(vis.x))
    vis.yAxis.transition(transTime2).call(vis.yAxisCall.scale(vis.y))

    // Add Y Axis Label
    //vis.yAxisLabel.text(vis.yVariable);

    // group for bars, divide up elements of array -- this makes transition operate cleaner
    vis.bars = vis.g.selectAll("rect")
        .data(vis.data, function(d) { /*console.log(d);*/ return d.category; })

    // exit the old bars
    vis.bars.exit()
        .attr("class", "exit")
        .transition(transTime2)
        .attr("height", 0)
        .attr("y", vis.height)
        .style("fill-opacity", "0.1")
        .remove();

    // UPDATE old elements present in new data.
    vis.bars.attr("class", "update")
        .transition(transTime2)
            .attr("y", function(d){ return vis.y(d.sum / d.count); })
            .attr("height", function(d){ return (vis.height - vis.y(d.sum / d.count)); })
            .attr("x", function(d){ return vis.x(d.category) })
            .attr("width", vis.x.bandwidth)

    vis.bars.enter()
        .append("rect")
            .attr("x", function(d) {
                return vis.x(d.category);
            })
            .attr("y", function(d) {
                return vis.y(d.sum / d.count);
            })
            .attr("width", vis.x.bandwidth())
            .attr("height", function(d) {
                return vis.height - vis.y(d.sum / d.count);
            })
            .attr("fill", "#888888");
}
