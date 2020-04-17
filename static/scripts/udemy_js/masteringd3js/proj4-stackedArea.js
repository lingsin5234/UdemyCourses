/*
*   stackedArea.js
*   Mastering D3.js Course
*   Final Project - Corporate Dashboard
*/

// constructor function
StackedArea = function(_parentElement, _svgHeight, _svgWidth) {
    this.parentElement = _parentElement;
    this.svgHeight = _svgHeight;
    this.svgWidth = _svgWidth;

    this.initVis();
}

// initialize
StackedArea.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 30, right: 90, bottom: 30, left: 60};
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

    // Y Axis
    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.yAxisCall = d3.axisLeft();
    vis.yAxis = vis.g.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + vis.margin.left + ' ' + vis.margin.top + ')');

    // Stack
    vis.stack = d3.stack();

    // Stacked Area
    vis.areaPath = vis.g.append('path')

    vis.wrangleData();
}

// wrangle data
StackedArea.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();
}

// update visualization
StackedArea.prototype.updateVis = function() {

    // Area
    vis.area = d3.area()
        .x(function(d) { return vis.x(d.date); })
        .y0(vis.height)
        .y1(function(d) { return vis.y(d[vis.yVariable]); });

    // draw area




}
