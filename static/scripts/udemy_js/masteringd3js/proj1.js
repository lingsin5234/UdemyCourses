var p1_margin = { top: 25, bottom: 75, left: 90, right: 30}
var p1_width = 800 - p1_margin.left - p1_margin.right
var p1_height = 600 - p1_margin.top - p1_margin.bottom

var p1_svg = d3.select("#proj-1-chart").append("svg")
	.attr("width", p1_width + p1_margin.left + p1_margin.right)
	.attr("height", p1_height + p1_margin.top + p1_margin.bottom);

/* ---- Part of Lesson 2 ---- */
/*
var circle = p1_svg.append("circle")
	.attr("cx", 100)
	.attr("cy", 250)
	.attr("r", 70)
	.attr("fill", "grey");

var rect = p1_svg.append("rect")
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
        d.p1_height = +d.p1_height;  // this converts the strings to integers!
        console.log(typeof(d.p1_height));
    });

    var buildings = p1_svg.selectAll("rect")
        .data(data);

    buildings.enter()
        .append("rect")
            .attr("x", function(d,i) {
                return i * 50 + 10;
            })
            .attr("y", 0)
            .attr("width", 40)
            .attr("height", function(d) {
                return d.p1_height;
            })
            .attr("fill", "grey");

}).catch(function(error){
    console.log(error);
});*/


/* ---- First Project ---- */
d3.json("/static/data/revenues.json").then(function(data) {

    data.forEach(function(d) {
        d.profit = +d.profit;  // convert to integer
    });

    // group for the graph
    var p1_g = p1_svg.append("g")
        .attr("transform", "translate(" + p1_margin.left + " " + p1_margin.top + ")");

    // x-axis
    var x_axis = d3.scaleBand()
        .domain(data.map(function(d) { return d.month; }))
        .range([0, p1_width])
        .paddingInner(0.3)
        .paddingOuter(0.3);
    p1_xAxis = p1_svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + p1_margin.left + " " + (p1_height + p1_margin.top) + ")")
        .call(d3.axisBottom(x_axis));
    p1_xAxis.selectAll("text").attr("font-size", "15px")

    // y-axis
    var y_axis = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.revenue; })])
        .range([p1_height, 0]);
    p1_yAxis = p1_svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + p1_margin.left + " " + p1_margin.top + ")")
        .call(d3.axisLeft(y_axis));
    p1_yAxis.selectAll("text").attr("font-size", "15px")

    // plot the bars
    p1_g.selectAll("rect")
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
                return p1_height - y_axis(d.revenue);
            })
            .attr("fill", "#888888");

    // add X-axis label
    p1_g.append("text")
        .attr("transform", "translate(" + p1_width/2 + " " + (p1_height + p1_margin.bottom*2/3) + ")")
        .attr("text-anchor", "start")
        .attr("font-size", "1.2em")
        .text("Months");

    // add Y-axis label
    p1_g.append("text")
        .attr("transform", "translate(" + -(p1_margin.right * 5/2) + " " + (p1_height/2 + p1_margin.top) + ") rotate(-90)")
        .attr("text-anchor", "start")
        .attr("font-size", "1.2em")
        .text("Revenue");
});
