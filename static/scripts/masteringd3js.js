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
/*
d3.json("/static/data/data.json").then(function(data) {

    // extract just the Countries, we can iterate the year
    startYear = +d3.min(data, function(d) { return d.year; })
    const arrayOfYears = data.map(function(year) {
        // get all the income + life_exp is not null
        countriesByYear = year.countries.filter(function(country){
            var dataExists = (country.income && country.life_exp);
            return dataExists;
        });
        // change all income and life_exp to numeric
        countriesByYear.map(function(country){
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;
        });
        //console.log(countriesByYear);
        return countriesByYear;
    });

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
    //console.log(d3.max(arrayOfYears, function(d) { return d3.max(d, function(x) { return x.population; }) }))
    // Radius Scale (Population)
    var r_scale = d3.scaleLinear()
        .domain([0, d3.max(arrayOfYears, function(d) { return d3.max(d, function(x) { return x.population; }) })])
        .range([5, 25])

    // Ordinal Scale (Continents)
    var cont_scale = d3.scaleOrdinal(d3.schemeSet1)
        .domain([d3.extent(arrayOfYears, function(d) { return d3.extent(d, function(x) { return x.continent; }) })])

    // X-Axis Label
    yearGroup.append("text")
        .attr("transform", "translate(" + width/2 + " " + (height + margin.top*2) + ")")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .attr("fill", "#222D8F")
        .text("GDP per Capita ($)");

    // Y-Axis label
    yearGroup.append("text")
        .attr("transform", "translate(" + -margin.right + " " + height/2 + ") rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .attr("fill", "#222D8F")
        .text("Life Expectancy (years)");

    // Year label
    var year_label = yearGroup.append("text")
        .attr("transform", "translate(" + (width - margin.right) + " " + height + ")")
        .attr("text-anchor", "start")
        .attr("fill", "#222D8F")
        .attr("font-size", "1.5em");

    // update Data function
    function updateData(index) {

        // update Year label
            year_label.text(function(d) {
                year = (startYear + index);
                return year;
            });

        var newData = arrayOfYears[index];

        //console.log(circles);
        // adjust all the circles
        var circles = yearGroup.selectAll("circle")
            .data(newData, function(d) {
                //console.log(d);
                return d.country;
            });

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
    updateData(year_index);

    // add interval
    d3.interval(function(){

        // once year_index reaches max, just restart!
        year_index = (year_index < data.length) ? year_index+1 : 0
        console.log(year_index, data.length);
        // function to update the data
        updateData(year_index);

    }, 300);
});
*/

/* ---- Second Project Enhanced ---- */

d3.json("/static/data/data.json").then(function(data) {

    // extract just the Countries, we can iterate the year
    startYear = +d3.min(data, function(d) { return d.year; })
    const arrayOfYears = data.map(function(year) {
        // get all the income + life_exp is not null
        return year.countries.filter(function(country){
            var dataExists = (country.income && country.life_exp);
            return dataExists;
        }).map(function(country){
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;
        });
    });

    // set year_index
    var year_index = 0;

    // setup group
    var yearGroup = svg.append("g")
        .attr("transform", "translate(" + margin.left + " " + margin.top + ")");

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
        .domain([0, d3.max(arrayOfYears, function(d) { return d3.max(d, function(x) { return x.population; }) })])
        .range([5, 25]);

    // Ordinal Scale (Continents)
    var cont_scale = d3.scaleOrdinal(d3.schemeSet1);

    // X-Axis Label
    yearGroup.append("text")
        .attr("transform", "translate(" + width/2 + " " + (height + margin.top*2) + ")")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .attr("fill", "#222D8F")
        .text("GDP per Capita ($)");

    // Y-Axis label
    yearGroup.append("text")
        .attr("transform", "translate(" + -margin.right + " " + height/2 + ") rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-size", "1.2em")
        .attr("fill", "#222D8F")
        .text("Life Expectancy (years)");

    // Year label
    var year_label = yearGroup.append("text")
        .attr("transform", "translate(" + (width - margin.right) + " " + (height - 10) + ")")
        .attr("text-anchor", "start")
        .attr("fill", "#222D8F")
        .attr("font-size", "1.5em");

    // Add a Continent Legend -- this one will be fixed.
    var continents = ['americas', 'europe', 'asia', 'africa']
    var cont_group = yearGroup.append("g")
        .attr("transform", "translate(" + (width - margin.right) + " " + (height - 120) + ")")
    continents.forEach(function(d,i) {
        var group = cont_group.append("rect")
            .attr("transform", "translate(" + -25 + " " + (i * 20) + ")")
            .attr("width", 15).attr("height", 15)
            .attr("fill", cont_scale(d));
        var text = cont_group.append("text")
            .attr("transform", "translate(" + -5 + " " + (i * 20 + 12) + ")")
            .attr("text-anchor", "start")
            .attr("font-size", "1em")
            .text(d)
    })

    // add tooltip
    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        //console.log(d);
        var text = "<strong>Country</strong>: <span>" + d.country + "</span><br>"
        text = text + "<strong>Continent</strong>: <span>" + d.continent + "</span><br>"
        text = text + "<strong>GDP per Capita</strong>: <span>" + d3.format("$,.0f")(d.income) + "</span><br>"
        text = text + "<strong>Population</strong>: <span>" + d3.format(",.0f")(d.population) + "</span><br>"
        text = text + "<strong>Life Expectancy</strong>: <span>" + d3.format(".2f")(d.life_exp) + "</span><br>"
        return text;
    });
    yearGroup.call(tip);

    // new interval can be start/paused or reset
    $("#play-button")
        .on("click", function() {
            var button = $(this);
            if (button.text() == "Play"){
                interval = setInterval(step, 100);
                button.text("Pause");
            } else {
                clearInterval(interval);
                button.text("Play");
            }
        });

    $("#reset-button")
        .on("click", function() {
           year_index = 0;
           updateData(year_index);
        });

    function step() {
        // note that this starts with the second one -- year_index = 1
        // it runs 214 once at the end at "213"
        year_index = (year_index < (data.length-1)) ? year_index+1 : 0
        updateData(year_index);
    }

    $("#continent-select")
        .on("change", function() {
            updateData(year_index);
        })

    $("#date-slider").slider({
        max: +d3.max(data, function(d) { return d.year; }),
        min: +d3.min(data, function(d) { return d.year; }),
        step: 1,
        slide: function(event, ui){
            year_index = ui.value - startYear;
            updateData(year_index);
        }
    })

    // update Data function
    function updateData(index) {

        // set transition time
        var t = d3.transition().duration(100);

        // update Year label
            year_label.text(function(d) {
                year = (startYear + index);
                return year;
            });

        var continent = $("#continent-select").val();
        var newData = arrayOfYears[index];

        // much cleaner version!!
        newData = newData.filter(function(d) {
            if (continent == "all") { return true; }
            else { return d.continent == continent; }
        })

        //console.log(circles);
        // adjust all the circles
        var circles = yearGroup.selectAll("circle")
            .data(newData, function(d) {
                return d.country;
            });

        circles.exit()
            .attr("class", "exit")
            .remove();

        circles.enter()
            .append("circle")
            .attr("class", "enter")
            .attr("fill", function(d) { return cont_scale(d.continent); })
            .attr("opacity", 0.7)
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .merge(circles)
            .transition(t)
                .attr("cx", function(d) { return x_axis(d.income); })
                .attr("cy", function(d) { return y_axis(d.life_exp); })
                .attr("r", function(d) { return r_scale(d.population); })

        $("#date-slider").slider("value", +(year_index + startYear))
        $("#year").text(year_index + startYear)
    };
    updateData(year_index);

});


/* ---- Third Project ---- */

