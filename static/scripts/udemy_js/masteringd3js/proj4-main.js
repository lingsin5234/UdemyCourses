/*
*   main.js
*   Mastering D3.js Course
*   Final Project - Corporate Dashboard
*/

var dataSet,
    timeline2,
    stackedArea;
var parseTime2 = d3.timeParse("%d/%m/%Y");
var formatTime2 = d3.timeFormat("%d/%m/%Y");
var transTime2 = function(){ return d3.transition().duration(100); }

$("#var-select-proj4").on("change", function() {
    timeline2.wrangleData();
})

brushed2 = function() {
    var selection = d3.event.selection || timeline2.x.range();
    var newValues = selection.map(timeline2.x.invert);

    $("#dateLabel1-proj4").text(formatTime2(newValues[0]));
    $("#dateLabel2-proj4").text(formatTime2(newValues[1]));
    // stackedArea.wrangleData();
}

d3.json("/static/data/calls.json").then(function(data) {

    //console.log(data);
    dataSet = data.filter(function(d) {
        return (d.call_duration && d.call_revenue && d.units_sold);
    });
    dataSet.forEach(function(d) {
        d.call_duration = +d.call_duration;
        d.call_revenue = +d.call_revenue;
        d.units_sold = +d.units_sold;
        d.date = parseTime2(d.date);
    });

    timeline2 = new TimeLine("#timeline", 250, 700)

    timeline2.wrangleData();
}).catch(function(error) { console.log(error); });




