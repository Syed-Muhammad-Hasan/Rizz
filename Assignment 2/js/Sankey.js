// Copyright 2021-2023 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/sankey-diagram

import Papa from 'https://cdn.skypack.dev/papaparse@5.3.0';
import * as d3 from 'https://cdn.skypack.dev/d3@7.6.0';
import * as d3Sankey from 'https://cdn.skypack.dev/d3-sankey@0.12.0';

const stateDropdown = document.getElementById('id_label_multiple');


// Fetch the JSON file containing state names
fetch('../data/StatesDropdown.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();  // Parse the response as JSON
  })
  .then(statesData => {
    // Parse the string into a JavaScript array
    const statesArray = JSON.parse(statesData);

    // Iterate through the array of state names
    statesArray.forEach(state => {
      const option = document.createElement('option');
      option.value = state;
      option.text = state;
      stateDropdown.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error loading or parsing the JSON file:', error);
  });




$('.js-example-basic-multiple').select2({
  tags: "true",
  placeholder: "Select an option",
  allowClear: true
});



$('.js-example-basic-multiple').on('change', function() {
  var selectedStates = $('.js-example-basic-multiple').val();
  console.log(selectedStates);
  const promises = selectedStates.map(selectedState => {
    // Construct the path to the CSV file based on the selected state
    const csvFile = `../data/${selectedState}.csv`;

    // Fetch and parse the selected CSV file
    return fetch(csvFile)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok for file: ${csvFile}`);
        }
        return response.text();
      })
      .then(csvData => {
        return Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
        });
      });
  });

  // Use Promise.all to wait for all promises to resolve
  Promise.all(promises)
    .then(parsedDatas => {
      // Combine the data from all selected CSV files into a single array
      let mergedData = parsedDatas.reduce((accumulator, current) => {
        console.log("CURRENT DATA: ", current.data)
        return accumulator.concat(current.data);
      }, []);

      // Your existing code for creating the Sankey chart

      mergedData = mergedData.filter(obj => Object.values(obj).every(value => value !== null));

      console.log("ASDSADASDASDSAD ", mergedData.length);
      let height = 0;
      height = mergedData.length - 133 ;
      if(height>0)
      {
        height = height * 5
        console.log("THIS IS WID: ", height)
      }
      else{
        height = 0
        console.log("THIS IS WID: ", height)
      }

      height = height + 600

      console.log("THIS IS WID: ", height)

      tree = mergedData

      let chart = SankeyChart({
        links: tree
      }, {
        nodeGroup: d => d.id, // Adjust if necessary based on your data structure
        format: (f => d => `${f(d)} Trees`)(d3.format(",.1~f")),
        height
      });

      const svgContainer = document.getElementById('svgContainer');
      svgContainer.innerHTML = ''; // Clear previous chart
      svgContainer.appendChild(chart);
    })
    .catch(error => {
      console.error('Error loading or parsing the files:', error);
    });
})


let tree;


function SankeyChart({
    nodes, // an iterable of node objects (typically [{id}, …]); implied by links if missing
    links, // an iterable of link objects (typically [{source, target}, …])
  }, {
    format = ",", // a function or format specifier for values in titles
    align = "justify", // convenience shorthand for nodeAlign
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeLabel, // given d in (computed) nodes, text to label the associated rect
    nodeTitle = d => `${d.id}\n${format(d.value)}`, // given d in (computed) nodes, hover text
    nodeAlign = align, // Sankey node alignment strategy: left, right, justify, center
    nodeSort, // comparator function to order nodes
    nodeWidth = 20, // width of node rects
    nodePadding = 10, // vertical separation between adjacent nodes
    nodeLabelPadding = 6, // horizontal separation between node and label
    nodeStroke = "currentColor", // stroke around node rects
    nodeStrokeWidth, // width of stroke around node rects, in pixels
    nodeStrokeOpacity, // opacity of stroke around node rects
    nodeStrokeLinejoin, // line join for stroke around node rects
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkValue = ({value}) => value, // given d in links, returns the quantitative value
    linkPath = d3Sankey.sankeyLinkHorizontal(), // given d in (computed) links, returns the SVG path
    linkTitle = d => `${d.source.id} → ${d.target.id}\n${format(d.value)}`, // given d in (computed) links
    linkColor = "source-target", // source, target, source-target, or static color
    linkStrokeOpacity = 0.7, // link stroke opacity
    linkMixBlendMode = "multiply", // link blending mode
    colors = d3.schemeTableau10, // array of colors
    width = 928, // outer width, in pixels
    height = 600, // outer height, in pixels
    marginTop = 5, // top margin, in pixels
    marginRight = 1, // right margin, in pixels
    marginBottom = 5, // bottom margin, in pixels
    marginLeft = 1, // left margin, in pixels
  } = {}) {
    // Convert nodeAlign from a name to a function (since d3-sankey is not part of core d3).
    if (typeof nodeAlign !== "function") nodeAlign = {
      left: d3Sankey.sankeyLeft,
      right: d3Sankey.sankeyRight,
      center: d3Sankey.sankeyCenter
    }[nodeAlign] ?? d3Sankey.sankeyJustify;
  
    // Compute values.
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const LV = d3.map(links, linkValue);
    if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), id => ({id}));
    const N = d3.map(nodes, nodeId).map(intern);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  
    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i], value: LV[i]}));
  
    // Ignore a group-based linkColor option if no groups are specified.
    if (!G && ["source", "target", "source-target"].includes(linkColor)) linkColor = "currentColor";
  
    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = G;
  
    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);
  
    // Compute the Sankey layout.
    d3Sankey.sankey()
        .nodeId(({index: i}) => N[i])
        .nodeAlign(nodeAlign)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .nodeSort(nodeSort)
        .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
      ({nodes, links});
  
    // Compute titles and labels using layout nodes, so as to access aggregate values.
    if (typeof format !== "function") format = d3.format(format);
    const Tl = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(nodes, nodeLabel);
    const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const Lt = linkTitle == null ? null : d3.map(links, linkTitle);
  
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    const node = svg.append("g")
        .attr("stroke", nodeStroke)
        .attr("stroke-width", nodeStrokeWidth)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-linejoin", nodeStrokeLinejoin)
      .selectAll("rect")
      .data(nodes)
      .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0);
  
    if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (Tt) node.append("title").text(({index: i}) => Tt[i]);
  
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", linkStrokeOpacity)
      .selectAll("g")
      .data(links)
      .join("g")
        .style("mix-blend-mode", linkMixBlendMode);
  
    if (linkColor === "source-target") link.append("linearGradient")
        .attr("id", d => `${uid}-link-${d.index}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0)
        .call(gradient => gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", ({source: {index: i}}) => color(G[i])))
        .call(gradient => gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", ({target: {index: i}}) => color(G[i])));
  
    link.append("path")
        .attr("d", linkPath)
        .attr("stroke", linkColor === "source-target" ? ({index: i}) => `url(#${uid}-link-${i})`
            : linkColor === "source" ? ({source: {index: i}}) => color(G[i])
            : linkColor === "target" ? ({target: {index: i}}) => color(G[i])
            : linkColor)
        .attr("stroke-width", ({width}) => Math.max(1, width))
        .call(Lt ? path => path.append("title").text(({index: i}) => Lt[i]) : () => {});
  
    if (Tl) svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
      .selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(({index: i}) => Tl[i]);
  
    function intern(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    }
  
    return Object.assign(svg.node(), {scales: {color}});
  }