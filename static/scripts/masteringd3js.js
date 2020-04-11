var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

/* ---- Part of Lesson 2 ---- */
/*
var circle = svg.append("circle")
	.attr("cx", 100)
	.attr("cy", 250)
	.attr("r", 70)
	.attr("fill", "grey");

var rect = svg.append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 50)
    .attr("height", 20)
    .attr("fill", "red")
*/

/* ---- Activity: 15 ---- */
d3.json("/static/data/buildings.json").then(function(data) {
    console.log(data);
    data.forEach(function(d) {
        d.height = +d.height;  // this converts the strings to integers!
        console.log(typeof(d.height));
    });

    var buildings = svg.selectAll("rect")
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
});

