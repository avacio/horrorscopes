class ZodiacCycle {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 600,
    }

    this.data = _config.data;

    console.log("Init ZodiacCycle View");


    this.initVis();
  }

  initVis() {
    let vis = this;

    //    vis.force = d3.layout.force(); 

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight)
    //      .attr("transform", "translate(" + ( vis.config.containerWidth / 2) + "," + ( vis.config.containerHeight / 2) + ")")
    ;

    //          .attr("transform", "translate(" + ( vis.config.containerWidth / 2 + margin.left) + "," + ( vis.config.containerHeight / 2 + margin.top) + ")");

    vis.chart = vis.svg.append('g');


    vis.tooltip = d3.select('#visRow').append("div")
      .attr('class', 'tooltip')
      .attr('width', 70)
      .attr('height', 100)
      .style('opacity', .0);

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

    ///////////////////////////////
    //Append the month names to each slice
    //    vis.svg.selectAll(".monthText")
    //      .data(vis.data)
    //    //    .enter()
    //      .join('text')
    //    //  .append("text")
    //      .attr("class", "monthText")
    //      .append("textPath")
    //      .attr("xlink:href",function(d,i){return "#monthArc_"+i;})
    //      .text(function(d){return d.month;});
  }

  update() {
    let vis = this;

    // If show-fate button is pressed, then sprites will change to show the dogs who died in action
    //    if (vis.showFate) {
    //      vis.imagePath = (vis.data, d => {
    //        let path = 'src/space-dog';
    //        path += (d.Gender == 'Female' ? '-yellow' : '-pink');
    //        path += (d.Fate.includes('Died') ? '-angel.png' : '.png');
    //        return path;
    //      });
    //    } else {
    //      vis.imagePath = (vis.data, d => (d.Gender == "Female" ? 'src/space-dog-yellow.png' : 'src/space-dog-pink.png'));
    //    }

    if (vis.data) {

      //        const links = data.links.map(d => Object.create(d));
      //  const nodes = data.nodes.map(d => Object.create(d));

      const keys = d3.keys(vis.data);
      const nodes = d3.entries(vis.data);

      //      const nodes = Object.keys(vis.data);
      const entries = Object.entries(vis.data);

      //              return d.value.length })
      //console.log(keys)
      //      const links = nodes.map(d => { 
      //                console.log("d: " + d.key);
      //        if (d.key != "Unknown") {
      //          return Object.create({source: "root", target: d.key});
      //        }
      //      });

      let links = [];

      nodes.forEach(d => {
        if (d.key != "Unknown") {
          links.push({source: "root", target: d.key});
        }
      });
      nodes.push({key:"root", value:[]});


      console.log("links: " + links.length);
      console.log("links: " + links);

      links.forEach(d => {
        console.log(d);
      })
      //      const keys = Object.keys(vis.data);

      //      vis.numFlights = (vis.data, d => {return d.Flights ? d.Flights.split(',').length : 0});
      //
      //      vis.sizeScale = d3.scaleSqrt()
      //        .domain(d3.extent(vis.data, d => vis.numFlights(d)))
      //        .range([60, 200])
      //        .nice();

      //      const links = data.links.map(d => Object.create(d));
      //      const nodes = vis.data.map(d => Object.create(d));

      //      const nodes = keys.map(d => Object.create(d));
      //      nodes.push({key:"root", value:[]});
      console.log("nodes: " + nodes);
      //      
      console.log("NODES: " + nodes.length);
      //      console.log("NODES: " + vis.data.length);

      const simulation = d3.forceSimulation(nodes)
      //            .force("link", d3.forceLink(links).id(d => d.id))
//      .force("link", d3.forceLink().links(links))
            .force("link", d3.forceLink(links).id(d => {
//              console.log("FORCE LINK: " + d.key);
              return d.key}))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(vis.containerWidth / 2, vis.containerHeight / 2));

      const link = vis.svg.append("g")
      .attr("stroke", "#FF0000")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      //      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke-width", d => Math.sqrt(20))
      ;

      const node = vis.svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      //      .data(entries)
      .join("circle")
      .attr("r", d => {
        ////        console.log("d: " + d.value);
        //        console.log("d.length: " + d.length);
        ////        console.log("TEST: " + vis.data[d].length);
        //        console.log("TEST: " + d.value.length);
        return d.value.length })
      //      .attr("r", d => d.length)
      //      .attr("r", 20)
      //      .attr("fill", "FF0000")
      //      .attr("x", (d, i) => (i % 8) * 150 + 50)
      //      .attr("y",  (d, i) => i * 22 + 50)
      //      .attr("cx", vis.config.containerWidth/2)
      //      .attr("cy",  vis.config.containerHeight/2)
      //      .attr("fill", color)
      //      .call(drag(simulation))
      ;

      node.append("title")
      //       node.append("p")
        .text(d => d.key);

      //        simulation.on("tick", () => {
      //    link
      //        .attr("x1", d => d.source.x)
      //        .attr("y1", d => d.source.y)
      //        .attr("x2", d => d.target.x)
      //        .attr("y2", d => d.target.y);
      //
      //    node
      //        .attr("cx", d => d.x)
      //        .attr("cy", d => d.y);
      //  });

      simulation.on("tick", () => {
        //    link
        //        .attr("x1", d => d.source.x)
        //        .attr("y1", d => d.source.y)
        //        .attr("x2", d => d.target.x)
        //        .attr("y2", d => d.target.y);

//        node
//          .attr("cx", d => d.x)
//          .attr("cy", d => d.y);
      });

      //        invalidation.then(() => simulation.stop());
      return vis.svg.node();

      vis.render();
    }
  }

  render() {
    let vis = this;

    //     c = Math.min(width, height) / 2,
    //      ro = Math.min(width, height) / 2 - (c * .3),
    //      ri = Math.min(width, height) / 2 - (c * .6),
    //      a = (Math.PI * 2) / data.length,
    //      colors = d3.scale.category10();


    //    // render space dogs
    //    vis.chart.selectAll('image')
    //      .data(vis.data)
    //      .join('image')
    //      .attr('class', 'space-dog')
    //    // Rotation classes for "floating" animation
    //      .classed('rotateC0', (d,i) => vis.floatOn && i % 5)
    //      .classed('rotateC1', (d,i) => vis.floatOn && i % 7)
    //      .classed('rotateCC0', (d,i) => vis.floatOn && i % 6)
    //      .classed('rotateCC1', (d,i) => vis.floatOn && i % 4)
    //      .transition()
    //    // Get respective space dog sprite
    //      .attr("xlink:href", d => vis.imagePath(d))
    //      .attr("x", (d, i) => (i % 8) * 150 + 50)
    //      .attr("y",  (d, i) => i * 22 + 50)
    //    // Size of dog is based on the number of space missions they have been on
    //      .attr("width", d => vis.sizeScale(vis.numFlights(d)))
    //      .attr("height", d => vis.sizeScale(vis.numFlights(d)));


    // Tooltip!
    //    const tooltipMouseover = (d) => {
    //      vis.tooltip.html(d["Name (English)"] + '<br>' + d["Flights"] + '<br>' +d["Notes"])
    //        .style('left', (d3.event.pageX + 15) + "px")
    //        .style('top', (d3.event.pageY - 28) + "px")
    //        .transition()
    //        .style('opacity', .9); // started as 0!
    //    };

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