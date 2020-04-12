var margin = { top: 25, bottom: 75, left: 90, right: 30}
var width = 800 - margin.left - margin.right
var height = 600 - margin.top - margin.bottom

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

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
/*
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
});*/


/* ---- First Project ---- */
/*
d3.json("/static/data/revenues.json").then(function(data) {

    data.forEach(function(d) {
        d.profit = +d.profit;  // convert to integer
    });

    // group for the graph
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

    // x-axis
    var x_axis = d3.scaleBand()
        .domain(data.map(function(d) { return d.month; }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin.left + " " + (height + margin.top) + ")")
        .call(d3.axisBottom(x_axis));

    // y-axis
    var y_axis = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.revenue; })])
        .range([height, 0]);
    svg.append("g")
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

/* ---- Second Project ---- */
d3.json("/static/data/data.json").then(function(data) {

    data.forEach(function(d) {
        //console.log(d);
        d.year = +d.year;
    })

    // year index
    year_index = 0;
    // start with just 1 year
    var newData = data[year_index];
    //console.log(newData);
    //console.log(d3.min(data, function(d) { return d3.min(d.countries, function(x) { return x.income; }); }));

    // filter out the null pop/income/life_exp countries
    var index = newData.countries.length - 1;
    while (index != -1) {
        d = newData.countries[index];
        if (d.population == null || d.income == null || d.life_exp == null) {
            //console.log(d);
            newData.countries.splice(index,1);
        }
        index--;
    }
    //console.log(newData);

    // set transition time
    var t = d3.transition().duration(100);

    // setup group
    var yearGroup = svg.append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")");
        //.selectAll(".plot-group")
        //.data(data).enter();

    // setup plotGroup
    var plotGroup = yearGroup.append("g")
        .attr("class", "plot-group")
        .attr("transform", "translate(0 0)");

    // X-Axis
    var x_axis = d3.scaleLog()
        .base(10)
        .domain([100, 150000])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(" + margin.left + " " + (height + margin.top) + ")")
        .call(
            d3.axisBottom(x_axis)
                .tickValues([400, 4000, 40000])
                .tickFormat(d3.format("$"))
        );

    // Y-Axis
    var y_axis = d3.scaleLinear()
        .domain([0, 90])
        .range([height, 0]);
    svg.append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")")
        .call(d3.axisLeft(y_axis));

    // Radius Scale (Population)
    var r_scale = d3.scaleLinear()
        .domain([0, d3.max(newData.countries, function(d) { return d.population; })])
        .range([5, 25])

    // Ordinal Scale (Continents)
    var cont_scale = d3.scaleOrdinal(d3.schemeSet1)
        .domain([d3.extent(newData.countries, function(d) { return d.continent; })])

    // plot the dots
    var circles = yearGroup.selectAll("circle")
        .data(newData);

    // X-Axis Label
    yearGroup.append("text")
        .attr("transform", "translate(" + width/2 + " " + (height + margin.top*2) + ")")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .text("GDP per Capita ($)");

    // Y-Axis label
    yearGroup.append("text")
        .attr("transform", "translate(" + -margin.right + " " + height/2 + ") rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .text("Life Expectancy (years)");

    // Year label
    var year_label = yearGroup.append("text")
        .attr("transform", "translate(" + (width - margin.right) + " " + height + ")")
        .attr("text-anchor", "start")
        .attr("font-size", "1.5em");

    // update Data function
    function updateData(newData) {

        // get rid of nulls
        var index = newData.countries.length - 1;
        while (index != -1) {
            d = newData.countries[index];
            if (d.population == null || d.income == null || d.life_exp == null) {
                //console.log(d);
                newData.countries.splice(index,1);
            }
            index--;
        }

        // update Year label
        year_label.text(function(d) {
            return newData.year;
        });

        //console.log(circles);
        // adjust all the circles
        circles = yearGroup.selectAll("circle")
            .data(newData.countries);

        circles.exit()
            .attr("class", "exit")
            .transition(t)
                //.attr("cy", function(d) { return y_axis(d.life_exp); })
                //.attr("r", function(d) { return r_scale(d.population); })
                .attr("opacity", 0)
            .remove();

        circles.enter()
            .append("circle")
            .attr("class", "enter")
            .attr("fill", function(d) { return cont_scale(d.continent); })
            .merge(circles)
                //.attr("value", function(d) { return d.country; })
                .attr("r", function(d) { return r_scale(d.population); })
                .transition(t)
                    .attr("cx", function(d) { return x_axis(d.income); })
                    .attr("cy", function(d) { return y_axis(d.life_exp); })
                    .attr("opacity", 0.7);


    };
    updateData(newData);

    // add interval
    d3.interval(function(){

        // increment index and then check if it has reached max
        year_index++;
        if (year_index < data.length) {
            newData = data[year_index];

            // function to update the data
            updateData(newData);
        }

    }, 1000);
});
