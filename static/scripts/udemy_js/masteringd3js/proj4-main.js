/*
*   main.js
*   Mastering D3.js Course
*   Final Project - Corporate Dashboard
*/

var allCalls = {};
var callSums,
    nestedCalls;
var timeline2,
    stackedArea,
    barChart1, barChart2, barChart3;
var parseTime2 = d3.timeParse("%d/%m/%Y");
var formatTime2 = d3.timeFormat("%d/%m/%Y");
var transTime2 = function(){ return d3.transition().duration(100); }

$("#var-select-proj4").on("change", function() {
    updateGraphs();
})

brushed2 = function() {
    var selection = d3.event.selection || timeline2.x.range();
    var newValues = selection.map(timeline2.x.invert);

    $("#dateLabel1-proj4").text(formatTime2(newValues[0]));
    $("#dateLabel2-proj4").text(formatTime2(newValues[1]));
    stackedArea.wrangleData();
    barChart1.wrangleData();
    barChart2.wrangleData();
    barChart3.wrangleData();
}

updateGraphs = function() {
    timeline2.wrangleData();
    stackedArea.wrangleData();
    barChart1.wrangleData();
    barChart2.wrangleData();
    barChart3.wrangleData();
}

d3.json("/static/data/calls.json").then(function(data) {

    //console.log(data);
    data.filter(function(d) {
        return (d.call_duration && d.call_revenue && d.units_sold);
    });
    data.forEach(function(d) {
        d.call_duration = +d.call_duration;
        d.call_revenue = +d.call_revenue;
        d.units_sold = +d.units_sold;
        d.date = parseTime2(d.date);
    });

    // allCalls contains everything from original data set
    allCalls = data;

    // callSums is everything summed up - used for timeline
    // .nest is useful in that it can set the KEY and the VALUES (to everything inside it, e.g. "call_revenue")
    callSums = d3.nest()
        .key(function(d){ return formatTime2(d.date); })
        .entries(allCalls)
            // the map returns as object with date, sum keys
            .map(function(day){
                return {
                    date: day.key,
                    // reduce takes all the values from the day Object, values and SUMs upon return
                    sum: day.values.reduce(function(accumulator, current){
                        return accumulator + current["call_revenue"]
                    }, 0)
                }
            });

    // nestedCalls is splitting the calls by category
    nestedCalls = d3.nest()
        .key(function(d){
            return d.category;
        })
        .entries(allCalls)

    //console.log(allCalls);
    //console.log(callSums);
    //console.log(nestedCalls);

    timeline2 = new TimeLine("#timeline", 250, 700);
    stackedArea = new StackedArea("#stacked-area", 450, 700);
    barChart1 = new BarChart("#units-sold", 300, 450, "units_sold");
    barChart2 = new BarChart("#revenue", 300, 450, "call_revenue");
    barChart3 = new BarChart("#call-duration", 300, 450, "call_duration");

}).catch(function(error) { console.log(error); });




