var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geoAlbersUsa()
  .translate([width / 2, height / 2]) // translate to center of screen
  .scale([1000]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  .projection(projection); // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg = d3.select("#ChoroplethMapsContainer")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Load in my states data!
d3.csv("../data/State_Level_data.csv").then(function(data) {
	var dataArray = [];
	for (var d = 0; d < data.length; d++) {
		dataArray.push(data[d].totalTrees)
	}
	var minVal = d3.min(dataArray)
	var maxVal = d3.max(dataArray)
	var ramp = d3.scaleSequential(d3.interpolateGreens)
            .domain([0, maxVal]);
	
  // Load GeoJSON data and merge with states data
  d3.json("https://gist.githubusercontent.com/wboykinm/dbbe50d1023f90d4e241712395c27fb3/raw/9753ba3a47f884384ab585a42fc1be84a4a474ca/us-states.json").then(function(json) {

    // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {

      // Grab State Name
      var dataState = data[i].name;

      // Grab data value 
      var dataValue = data[i].totalTrees;

      var Area =  data[i].totalArea;

      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;

        if (dataState == jsonState) {

          // Copy the data value into the JSON
          json.features[j].properties.totalTrees = dataValue;
          json.features[j].properties.totalArea = Area;

          // Stop looking through the JSON
          break;
        }
      }
    }
    
    var tooltip = d3.select("#ChoroplethMapsContainer")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");
    
    let mouseOver = function(d) {
        getArea = +(this.__data__.properties.totalArea);
        d3.selectAll(".state")
          .transition()
          .duration(200)
          .style("opacity", .1)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
        console.log(this);
        tooltip.style("opacity", 1)
        .html("<b>" + this.__data__.properties.name + "</b><br/>Total Area: " + getArea.toFixed(2) + " m<sup>2</sup><br/>Total Trees: " + this.__data__.properties.totalTrees)
        .style("left", (d.pageX + 10) + "px")
        .style("top", (d.pageY - 28) + "px");
      }
    
      let mouseLeave = function(d) {
        d3.selectAll(".state")
          .transition()
          .duration(200)
          .style("opacity", 1)
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "transparent")
         tooltip.style("opacity", 0);
      }

    // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function(d) { return ramp(d.properties.totalTrees) })
      .attr("class", function(d){ return "state" } )
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave);
    
		// add a legend
		var w = 140, h = 300;

		var key = d3.select("#ChoroplethMapsContainer")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.attr("class", "legend");

    var legendScale = d3.scaleSequential(d3.interpolateGreens)
      .domain([0, maxVal]);

		var legend = key.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", legendScale(maxVal))
			.attr("stop-opacity", 1);
			
		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", legendScale(0))
			.attr("stop-opacity", 1);

		key.append("rect")
			.attr("width", w - 100)
			.attr("height", h)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(0,10)");

		var y = d3.scaleLinear()
    .range([h, 0])
    .domain([minVal, maxVal]);

		var yAxis = d3.axisRight(y);

		key.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(41,10)")
			.call(yAxis)
  });
});