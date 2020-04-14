/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

var svg = d3.select("#proj-3-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
// For tooltip
var bisectDate = d3.bisector(function(d) { return d.year; }).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom()
var yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(function(d) { return parseInt(d / 1000) + "k"; });

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
    .attr("class", "y axis")

// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text("Population)");

// Line path generator
var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

/*
"bitcoin": [
        {
            "24h_vol": null,
            "date": "12/5/2013",
            "market_cap": null,
            "price_usd": null
        },
*/
d3.json("/static/data/coins.json").then(function(data) {

    // Data Cleaning
    newData = {}
    for (var coin in data) {
        newData[coin] = data[coin].filter(function(d) {
            var dataExists = (d["24h_vol"] && d.market_cap && d.price_usd)
            return dataExists;
        }).map(function(d) {
            var each_keys = Object.keys(d)
            for (i=0; i < each_keys.length; i++) {
                if (each_keys[i] == "date") {
                    d[each_keys[i]] = parseTime(d[each_keys[i]])
                }
                else {
                    d[each_keys[i]] = +d[each_keys[i]]
                }
            }
            return d;
        })
    }

    updateData();
});


// put all the parts to update in here
function updateData() {

    coin = "bitcoin"

    // Set scale domains
    //console.log(d3.extent(newData[coin], function(d) { return d.date; }));
    x.domain(d3.extent(newData[coin], d => d.date));
    y.domain([d3.min(newData[coin], d => d.price_usd) / 1.005,
        d3.max(newData[coin], d => d.price_usd) * 1.005]);

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x).tickFormat(d3.timeFormat("%Y")).ticks(5))
    yAxis.call(yAxisCall.scale(y))

    // declare d3.line()
    theLine = d3.line()
        .x(function(d) {
            //console.log(x(d.date));
            return x(d.date);
        })
        .y(d => y(d.price_usd))

    // Add line to chart
    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-with", "3px")
        .attr("d", theLine(newData[coin]));

    /******************************** Tooltip Code ********************************/

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    /*g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
        focus.select("text").text(d.value);
        focus.select(".x-hover-line").attr("y2", height - y(d.value));
        focus.select(".y-hover-line").attr("x2", -x(d.year));
    }*/


    /******************************** Tooltip Code ********************************/


}

/** WORKING SAMPLE **/
/*
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv")
    .then(function(data) {
        //console.log(typeof(data));
        //console.log(data);
        newData = data.map(function(d) {
            return { date : d3.timeParse("%Y-%m-%d")(d.date), value : +d.value }
        })
        //console.log(newData);

        x.domain(d3.extent(newData, function(d) { return d.date; }));
        //console.log(d3.extent(newData, function(d) { return d.date; }))
        y.domain(d3.extent(newData, function(d) { return d.value; }))
        //console.log(d3.extent(newData, function(d) { return d.value; }))

        xAxis.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")).ticks(5))
        yAxis.call(d3.axisLeft(y))
        console.log(x(newData[1].date))
        console.log(y(newData[0].value))

        update();
});

function update() {
        var data = newData;
        var theLine = d3.line()
            .x(function(d) {
                console.log(x(d.date));
                return x(d.date);
            })
            .y(function(d) {
                //console.log(d);
                return y(d.value);
            });
        console.log(theLine);

        var drawLine = g.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-with", "3px")
            .attr("d", theLine(data));
}*/