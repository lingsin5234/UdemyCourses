/*
*   timeline.js
*   Mastering D3.js Course
*   Final Project - Corporate Dashboard
*/

// constructor function
TimeLine = function(_parentElement, _svgHeight, _svgWidth) {
    this.parentElement = _parentElement;
    this.svgHeight = _svgHeight;
    this.svgWidth = _svgWidth;

    this.initVis();
};

// initialize
TimeLine.prototype.initVis = function() {
    var vis = this

    vis.margin = {top: 0, right: 100, bottom: 30, left: 60};
    vis.height = vis.svgHeight - vis.margin.top - vis.margin.bottom;
    vis.width = vis.svgWidth - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement).append('svg')
        .attr('height', vis.svgHeight).attr('width', vis.svgWidth);

    vis.g = vis.svg.append('g')
        .attr('transform', 'translate(' + vis.margin.left + ' ' + vis.margin.top + ')');

    // X Axis
    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.xAxisCall = d3.axisBottom().ticks(5);
    vis.xAxis = vis.g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + vis.margin.left + ' ' + (vis.height + vis.margin.top) + ')');

    // Y Axis - don't draw
    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    // stacked Area
    vis.areaPath = vis.g.append('path')
        .attr('fill', '#ccc');

    // initialize brush component
    vis.brush = d3.brushX()
        .handleSize(10)
        .extent([[0, 0], [vis.width, vis.height]])
        .on('brush', brushed2);

    // append brush component
    vis.brushComp = vis.g.append('g')
        .attr('class', 'brush')
        .call(vis.brush);

    vis.wrangleData();
};

// wrangle data
TimeLine.prototype.wrangleData = function() {
    var vis = this;

    // update based on selection(s)
    vis.yVariable = $("#var-select-proj4").val();
    vis.xDate1 = $("#dateLabel1-proj4").text();
    vis.xDate2 = $("#dateLabel2-proj4").text();

    // update the data set
    // console.log(vis.yVariable, vis.xDate1, vis.xDate2);
    // console.log([dataSet]);

    vis.updateVis();
};

// update visualization
TimeLine.prototype.updateVis = function() {
    var vis = this;

    // set domains and call x axis; y domain set but axis not called
    vis.x.domain(d3.extent(dataSet, function(d) { return d.date; }));
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(transTime2).call(vis.xAxisCall);

    vis.y.domain([d3.min(dataSet, function(d) { return d[vis.yVariable]; }),
        d3.max(dataSet, function(d) { return d[vis.yVariable]; })]);

    // stacked Area function
    vis.area = d3.area()
        .x(function(d) { return vis.x(d.date); })
        .y0(vis.height) // start at x-axis
        .y1(function(d) { return vis.y(d[vis.yVariable]); });

    // draw the area
    vis.areaPath
        .data([dataSet])  // needs to be array
        .attr('d', vis.area);
};
