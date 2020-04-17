var margin = { top: 25, bottom: 75, left: 90, right: 30}
var width = 800 - margin.left - margin.right
var height = 600 - margin.top - margin.bottom

var svg1 = d3.select("#proj-1-chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

/* ---- Part of Lesson 2 ---- */
/*
var circle = svg1.append("circle")
	.attr("cx", 100)
	.attr("cy", 250)
	.attr("r", 70)
	.attr("fill", "grey");

var rect = svg1.append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 50)
    .attr("height", 20)
    .attr("fill", "red")
*/

/* ---- Activity: 15 ---- */
/*
d3.json("/static/data/buildings.json").then(function(data) {
    console.log(data);
    data.forEach(function(d) {
        d.height = +d.height;  // this converts the strings to integers!
        console.log(typeof(d.height));
    });

    var buildings = svg1.selectAll("rect")
        .data(data);

    buildings.enter()
        .append("rect")
            .attr("x", function(d,i) {
                return i * 50 + 10;
            })
            .attr("y", 0)
            .attr("width", 40)
            .attr("height", function(d) {
                return d.height;
            })
            .attr("fill", "grey");

}).catch(function(error){
    console.log(error);
});*/


/* ---- First Project ---- */
/*
d3.json("/static/data/revenues.json").then(function(data) {

    data.forEach(function(d) {
        d.profit = +d.profit;  // convert to integer
    });

    // group for the graph
    var g = svg1.append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    // x-axis
    var x_axis = d3.scaleBand()
        .domain(data.map(function(d) { return d.month; }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);
    svg1.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin.left + " " + (height + margin.top) + ")")
        .call(d3.axisBottom(x_axis));

    // y-axis
    var y_axis = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.revenue; })])
        .range([height, 0]);
    svg1.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")")
        .call(d3.axisLeft(y_axis));

    // plot the bars
    g.selectAll("rect")
        .data(data).enter()
        .append("rect")
            .attr("x", function(d) {
                return x_axis(d.month);
            })
            .attr("y", function(d) {
                return y_axis(d.revenue);
            })
            .attr("width", x_axis.bandwidth())
            .attr("height", function(d) {
                return height - y_axis(d.revenue);
            })
            .attr("fill", "#888888");

    // add X-axis label
    g.append("text")
        .attr("transform", "translate(" + width/2 + " " + (height + margin.bottom) + ")")
        .attr("text-anchor", "start")
        .attr("font-size", "1.2em")
        .text("Months");

    // add Y-axis label
    g.append("text")
        .attr("transform", "translate(" + -(margin.right * 2) + " " + (height/2 + margin.top) + ") rotate(-90)")
        .attr("text-anchor", "start")
        .attr("font-size", "1.2em")
        .text("Revenue");
});
*/