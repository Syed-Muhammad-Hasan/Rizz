    // // Set the dimensions and margins of the graph
    // var margin = {top: 10, right: 180, bottom: 90, left: 50},
    //     width = 900 - margin.left - margin.right,
    //     height = 600 - margin.top - margin.bottom;

    // // Append the svg object to the body of the page
    // var svg = d3.select("#stacked")
    //     .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // // Create a tooltip
    // var tooltip = d3.select("body")
    //     .append("div")
    //     .attr("class", "tooltip");

    // // Load the CSV data
    // d3.csv("../data/stacked_other.csv").then(function (data) {

    //     // List of subgroups = header of the csv files = soil condition here
    //     var subgroups = data.columns.slice(1);

    //     console.log(data);
    //     // List of groups = species here = value of the first column called group -> I show them on the X axis
    //     var groups = d3.map(data, function (d) {
    //         return d.city;
    //     }).keys();

    //     // Add X axis with rotated labels
    //     var x = d3.scaleBand()
    //         .domain(groups)
    //         .range([0, width])
    //         .padding([0.2]);
    //     svg.append("g")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(d3.axisBottom(x).tickSizeOuter(0))
    //         .selectAll("text")
    //         .style("text-anchor", "end")
    //         .attr("transform", "rotate(-45)");

    //     // Add Y axis
    //     var y = d3.scaleLinear()
    //         .domain([0, 650000])
    //         .range([height, 0]);
    //     svg.append("g")
    //         .call(d3.axisLeft(y));

    //     // color palette = one color per subgroup
    //     var colorScheme = ['#557153', '#7D8F69', '#A9AF7E', '#D0E7D2', '#E6E5A3', '#CCC8AA'];

    //     // stack the data? --> stack per subgroup
    //     var stackedData = d3.stack()
    //         .keys(subgroups)
    //         .value(function (d, key) {
    //             return +d[key] || 0;
    //         })
    //         (data);

    //     console.log(stackedData);
    //     // Show the bars with animation
    //     svg.append("g")
    //         .selectAll("g")
    //         // Enter in the stack data = loop key per key = group per group
    //         .data(stackedData)
    //         .join("g")
    //         .attr("fill", function (d, i) {
    //             return colorScheme[i];
    //         })
    //         .selectAll("rect")
    //         // enter a second time = loop subgroup per subgroup to add all rectangles
    //         .data(function (d) {
    //             return d;
    //         })
    //         .join("rect")
    //         .attr("x", function (d) {
    //             return x(d.data.city);
    //         })
    //         .attr("y", function (d) {
    //             return y(d[1]);
    //         })
    //         .attr("height", function (d) {
    //             return y(d[0]) - y(d[1]);
    //         })
    //         .attr("width", x.bandwidth())
    //         .attr("stroke", "grey")
    //         .on("mouseover", showTooltip)
    //         .on("mousemove", moveTooltip) // Move tooltip with mouse
    //         .on("mouseout", hideTooltip)
    //         .transition()  // Add transition for a smooth animation
    //         .duration(1000)  // Duration of the animation in milliseconds
    //         .attr("y", function (d) {
    //             return y(d[1]);
    //         })
    //         .attr("height", function (d) {
    //             return y(d[0]) - y(d[1]);
    //         }); // Set the final height

    //     // Create a legend
    //     var legend = svg.append("g")
    //         .attr("class", "legend")
    //         .attr("transform", "translate(" + (width + 10) + ", 0)");

    //     var legendRectSize = 18;
    //     var legendSpacing = 4;

    //     var legendItems = legend.selectAll('.legend-item')
    //         .data(subgroups)
    //         .join('g')
    //         .attr('class', 'legend-item')
    //         .attr('transform', function (d, i) {
    //             var height = legendRectSize + legendSpacing;
    //             var vert = i * height;
    //             return 'translate(0,' + vert + ')';
    //         });

    //     legendItems.append('rect')
    //         .attr('width', legendRectSize)
    //         .attr('height', legendRectSize)
    //         .style('fill', function (d, i) {
    //             return colorScheme[i];
    //         });

    //     legendItems.append('text')
    //         .attr('x', legendRectSize + legendSpacing)
    //         .attr('y', legendRectSize - legendSpacing)
    //         .text(function (d, i) {
    //             return subgroups[i];
    //         });
    // });

    // // Tooltip functions
    // function showTooltip(d) {
    //     console.log("Tooltip Data:", d);  // Log the data object to the console
    //     var subgroupName = d3.select(this.parentNode).datum().key;
    //     tooltip.transition()
    //         .duration(200)
    //         .style("opacity", 0.9);
    //     tooltip.html("City: " + d.data.city + "<br>" +
    //         "Type: " + subgroupName + "<br>" +
    //         "Value: " + (d[1] - d[0]))
    //         .style("left", (d3.event.pageX) + "px")
    //         .style("top", (d3.event.pageY - 28) + "px");
    // }

    // function moveTooltip(d) {
    //     tooltip.style("left", (d3.event.pageX) + "px")
    //         .style("top", (d3.event.pageY - 28) + "px");
    // }

    // function hideTooltip() {
    //     tooltip.transition()
    //         .duration(500)
    //         .style("opacity", 0);
    // }



const margin = { top: 20, right: 50, bottom: 40, left: 70 };
const wrap = d3.select('#chart-wrap');
let wrapWidth = parseInt(wrap.style('width'));
let wrapHeight = parseInt(wrap.style('height'));
let width = wrapWidth - margin.left - margin.right;
let height = wrapHeight - margin.top - margin.bottom;
const x = d3.scaleBand();
const y = d3.scaleLinear();
const src = '../data/stackedTreeData.csv'; // Replace with the correct path to your data
const colors = d3.scaleOrdinal(['#5626C4', '#E60576', '#2CCCC3', '#FACD3D', '#181818', '#CCC8AA']);
let barGroup;
let tooltipChart;

// Tooltip
const tooltipMouseMove = (key, value) => {
  tooltipChart
    .html((d, i) => {
      return (
        `<div class="chart-tooltip-wrap">
          <p><strong>${key}</strong></p>
          <p>${value}</p>
         </div>`
      );
    })
    .style('visibility', 'visible')
    .style('left', `${d3.pointer(event)[0] + 10}px`)
    .style('top', `${d3.pointer(event)[1] + 20}px`);
}

const tooltipMouseOut = () => {
  tooltipChart.style('visibility', 'hidden');
}

// SVG
const svg = wrap.append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

// SVG aria tags
svg.append('title')
  .attr('id', 'chart-title')
  .html('Stacked bar chart');

svg.append('desc')
  .attr('id', 'chart-desc')
  .html('Displays stacked bar chart for different items.');

svg.attr('aria-labelledby', 'chart-title chart-desc');

tooltipChart = wrap.append('div')
  .attr('class', 'chart-tooltip')
  .style('visibility', 'hidden');

const group = svg.append('g')
  .attr('transform', `translate(${margin.left}, 0)`);

async function createStackedBars() {
  const data = await d3.csv(src);

  const stack = d3.stack().keys(data.columns.slice(1))(data);

  // Scales
  x.domain(data.map(d => d.city))
    .range([0, width])
    .padding(0.2);

  y.domain([0, d3.max(stack, d => d3.max(d, (d) => d[1] + margin.top))])
    .range([height, 0]);

  // Y Axis
  group.append('g')
    .attr('class', 'y-axis')
    .call(
      d3.axisLeft(y)
        .tickSizeOuter(0)
        .tickSize(-width)
    );

  d3.selectAll('.y-axis text')
    .attr('x', -10);

  // X Axis
  const xAxis = group.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // X axis labels
  xAxis.selectAll('text')
    .attr('transform', 'translate(-10, 0) rotate(-45)')
    .style('text-anchor', 'end');

  barGroup = group.selectAll('.bar-group')
    .data(stack)
    .enter()
    .append('g')
    .attr('class', 'bar-group')
    .attr('fill', d => colors(d.key));

  // Stacked bars
  bars = barGroup.selectAll('.rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('class', 'rect')
    .attr('x', d => x(d.data.city))
    .attr('y', height)
    .attr('height', 0)
    .attr('width', x.bandwidth())
    .attr('aria-label', d => `${d.data.city} bar`)
    // .on('mousemove', (event, d) => {
    //   tooltipMouseMove(d.data.city, d[1] - d[0]);
    // })
    // .on('mouseout', () => {
    //   tooltipMouseOut();
    // });

  // Bar transitions
  bars.transition()
    .delay(200)
    .duration(500)
    .ease(d3.easeLinear)
    .attr('height', d => y(d[0]) - y(d[1]))
    .attr('y', d => y(d[1]));

  // Legend
  const createLegend = (parent, cat) => {
    parent.append('div')
      .attr('class', 'legend')
      .selectAll('div')
      .data(stack)
      .enter()
      .append('div')
      .attr('class', 'legend-group')
      .html((d, i) => {
        return (`
          <div class="legend-box" style="background-color: ${colors(d.key)};"><p class="legend-label">${cat[i]}</p></div>
          
        `);
      });
  }
  createLegend(wrap, Object.keys(data[0]).slice(1));
}

createStackedBars();

// Resize
const resize = () => {
  wrapWidth = parseInt(wrap.style('width'));
  width = wrapWidth - margin.left - margin.right;

  // Scales
  x.range([0, width])
    .padding(0.2);

  y.range([height, 0]);

  if (width < 400) {
    x.padding(0.2);
  }

  svg.attr('width', width + margin.left + margin.right);

  barGroup.selectAll('rect')
    .attr('x', d => x(d.data.city))
    .attr('width', x.bandwidth());

  group.select('.x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  group.select('.y-axis')
    .call(
      d3.axisLeft(y)
        .tickSizeOuter(0)
        .tickSize(-width)
    );
}

d3.select(window).on('resize', resize);
