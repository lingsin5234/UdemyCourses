/*
*    main.js -- renamed to revised2.js
*    Mastering Data Visualization with D3.js
*    CoinStats - revised Project 3
*    -- using event Handlers in main.js
*/

// start with declarations
var newData2 = {};
var donutData = [];
var lineChart6,
    donutChart1,
    donutChart2;
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var colour = d3.scaleOrdinal(d3.schemeDark2);
var activeCoinSelected;

// transition function -- declared in proj3-main
// var transTime = function(){ return d3.transition().duration(1000); }

d3.json("/static/data/coins.json").then(function(data) {

    // Data Cleaning
    for (var coin in data) {
        newData2[coin] = data[coin].filter(function(d) {
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

        // Donut Data -- keep most recent date
        donutData.push({
            "coin": coin,
            "data": newData2[coin].slice(-1)[0]
        })
        //console.log(newData2["bitcoin"].slice(-1))
        //console.log(donutData);
    }



    // instead of updateData(), declare the lineChart and donutCharts
    lineChart6 = new LineChart("#line-chart-proj3-1", "bitcoin", newData2,
                    450, 750, "#var-select-proj3-e2", "#date-slider-proj3-e2", false);
    donutChart1 = new DonutChart("#donut-chart-proj3-1", "market_cap", donutData, 350, 400);
    donutChart2 = new DonutChart("#donut-chart-proj3-2", "24h_vol", donutData, 350, 400);
});

// coin selection change
$("#coin-select-proj3-e2").on("change", function() {
    //console.log("Coin Selected: ", this.value);
    activeCoinSelected = this.value;
    coinChange();
})

// variable selection change - only line graph changes
$("#var-select-proj3-e2").on("change", function() {
    lineChart6.wrangleData();
});

// slider
$("#date-slider-proj3-e2").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),
    min: parseTime("12/5/2013").getTime(),
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    step: (24 * 60 * 60 * 1000),  // milliseconds in a day
    slide: function(event, ui){
        $("#dateLabel1-e").text(formatTime(new Date(ui.values[0])));
        $("#dateLabel2-e").text(formatTime(new Date(ui.values[1])));
        coinChange();
    }
});

// when the arc is clicked, change dropdown AND coins focus (opacity)
function arcClicked(arc){
    $("#coin-select-proj3-e2").val(arc.data.coin);
    activeCoinSelected = arc.data.coin;
    //console.log("Arc Clicked: ", activeCoinSelected);
    coinChange();
}

// this function updates all 3 charts
function coinChange(){
    lineChart6.wrangleData()
    donutChart1.wrangleData()
    donutChart2.wrangleData()
}