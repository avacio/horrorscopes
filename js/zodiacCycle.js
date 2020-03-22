//import * as Util from './util';
//  include signsElementsDict from './util.js';
//"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
//
//const Util = require("./util");

//export default ZodiacCycle {
class ZodiacCycle {
  //import {signsElementsDict} from './util.js';
  //include {signsElementsDict}
  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 600,
    }


    this.data = _config.data;
    this.Util = _config.Util;
    this.isCyclicView = _config.isCyclicView || true;

    console.log("Init ZodiacCycle View");


    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g');
    vis.links = vis.chart.append("g")
      .attr("class", "link");
    vis.nodes = vis.chart.append("g")
      .attr("class", "node");


    vis.tooltip = d3.select('#visRow').append("div")
      .attr('class', 'tooltip')
      .attr('width', 70)
      .attr('height', 100)
      .style('opacity', .0);


    vis.iconPath = (vis.data, d => {
      return "src/zodiac-icons/" + d.key.toLowerCase() + ".png";
    });
    //      node.append("title")
    //      .text(d => d.id);

    //Create the SVG
    //var svg = d3.select("body").append("svg")
    //    .attr("width", 400)
    //    .attr("height", 120);

    ////Create an SVG path (based on bl.ocks.org/mbostock/2565344)
    //vis.svg.append("path")
    //    .attr("id", "wavy") //Unique id of the path
    //    .attr("d", "M 10,90 Q 100,15 200,70 Q 340,140 400,30") //SVG path
    //    .style("fill", "none")
    //    .style("stroke", "#AAAAAA");
    //
    ////Create an SVG text element and append a textPath element
    //vis.svg.append("text")
    //   .append("textPath") //append a textPath to the text element
    //    .attr("xlink:href", "#wavy") //place the ID of the path here
    //    .style("text-anchor","middle") //place the text halfway on the arc
    //    .attr("startOffset", "50%")
    //    .text("Yay, my text is on a wavy path");

  }

  update() {
    let vis = this;
    //    vis.isCyclicView = true;
    //    TODO


    if (vis.data) {


      //  const nodes = data.nodes.map(d => Object.create(d));

      // We don't need Unknown in this vis
      if ("Unknown" in vis.data) {
        delete vis.data["Unknown"];
      }

      const nodes = d3.entries(vis.data);

      //      const nodes = Object.keys(vis.data);
      const entries = Object.entries(vis.data);

      vis.sizeScale = d3.scaleSqrt()
        .domain(d3.extent(nodes, d => d.value.length))
        .range([15, 60])
        .nice();


      console.log("EXTENT: " + d3.extent(nodes, d => d.value.length));


      let links = [];
      //      let filter;
      const filter = (vis.data, d => {
        return d.key != "root" && 
          !vis.elements.includes(d.key)});

      if (vis.isCyclicView) {
        nodes.forEach(d => {
          links.push({source: "root", target: d.key});
        });
      } else {
        nodes.forEach(d => {
          links.push({source: vis.signsElementsDict[d.key], target: d.key});
        });

        vis.elements.forEach(d => {
          nodes.push({key:d, value:[]});
          links.push({source: "root", target: d});
        });
        //      filter = (vis.data, d => {
        //        return d.key != "root" && 
        //          !vis.elements.includes(d.key)});
        //          return "src/zodiac-icons/" + d.key.toLowerCase() + ".png";
      }

      nodes.push({key:"root", value:[]});

      links.forEach(d => {
        console.log(d);
      })

      console.log("nodes: " + nodes);
      console.log("NODES: " + nodes.length);

      let simulation;
      if (vis.isCyclicView) {
        //      const simulation = d3.forceSimulation(nodes)
        simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d =>d.key)
                 //                  .distance(vis.config.containerWidth/4)
                 .distance(200)
                )
        //      .force("charge", strength(-800))
          .force("charge", d3.forceManyBody().strength(-800))
        //      .force("charge").strength(-800))
          .force("collide", d3.forceCollide().strength(2))
          .force("center", d3.forceCenter(vis.config.containerWidth / 2, vis.config.containerHeight / 2));
      } else {
        simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d =>d.key)
                 //                  .distance(vis.config.containerWidth/4)
                 .distance(d => 90)
                 //             .distance(d => filter(d) ? 90 :1)
                )
          .force("charge", d3.forceManyBody().strength(-1000))
          .force("collide", d3.forceCollide().strength(2))

          .force("center", d3.forceCenter(vis.config.containerWidth / 2, vis.config.containerHeight / 2))
          .force("forceX", d3.forceX().strength(0.05).x(vis.config.containerWidth / 2))
          .force("forceY", d3.forceY().strength(0.1).y(vis.config.containerHeight / 2))
//          .force("forceY", d3.forceCenter(vis.config.containerWidth / 2, vis.config.containerHeight / 2))
        ;
      }

      const link = vis.links
      .selectAll("line")
      .data(links)
      .join("line")
      //      .attr("stroke-width", d => Math.sqrt(d.value))
      //      .attr("stroke-width", d => Math.sqrt(20))
      ;

      const node = vis.nodes
      .selectAll("circle")
      .data(nodes.filter(d => filter(d)))   
      .join("circle")
      .attr("class", d => vis.signsElementsDict[d.key])
      .attr("r", d => 
            vis.sizeScale(d.value.length)
           )
      .call(vis.drag(simulation))
      ;


      // icon image
      //      const image = node.append("g")
      //      const image = vis.chart.append('image')
      const image = vis.chart.selectAll('image')
      .attr("class", "node-icon")
      .data(nodes.filter(d => filter(d)))   
      .join("image")
      .attr("xlink:href", d => vis.iconPath(d))
      //      .attr("width", d => vis.sizeScale(d))
      //      .attr("height", d => vis.sizeScale(d))
      .attr("width", d => 50)
      .attr("height", d => 50)
      ;

      //      node.append("title")
      //      //       node.append("p")
      //        .text(d => d.key);

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
        image
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });

      //        invalidation.then(() => simulation.stop());

      vis.render();
    }
  }

  render() {
    let vis = this;

    const tooltipMouseout = (d) => {
      vis.tooltip.transition()
        .style('opacity', 0);
    };

    //    vis.chart.selectAll('.space-dog')
    //      .data(vis.data)
    //      .join('.space-dog')
    //      .on('mouseover', d => tooltipMouseover(d))
    //      .on('mouseout', d => tooltipMouseout(d));
  }

  drag = simulation => {

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
}