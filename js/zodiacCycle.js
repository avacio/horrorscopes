class ZodiacCycle {
  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      svg: _config.svg,
      //      containerWidth: _config.containerWidth || 1100,
      containerWidth: _config.containerWidth || 700,
      containerHeight: _config.containerHeight || 600,
    }

    this.data = _config.data;
    this.isCyclicView = _config.isCyclicView || true;

    this.OPTS = {
      aInternal: "Aquarius",
      aListener: function(val) {},
      set selectedSign(val) {
        this.aInternal = val;
        this.aListener(val);
      },
      get selectedSign() {
        return this.aInternal;
      },
      registerListener: function(listener) {
        this.aListener = listener;
      }
    }

    this.setPositions = true;
    console.log("Init ZodiacCycle View");

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.svg = d3.select(vis.config.svg)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append("g");
    vis.links = vis.chart.append("g")
      .attr("class", "link");
    vis.nodes = vis.chart.append("g")
      .attr("class", "node");
    vis.icons = vis.chart.append("g")
      .attr("class", "icons");

    vis.tooltip = d3.select(vis.config.parentElement)
      .append("div")
    //    vis.tooltip = d3.select('body').append("div")
      .attr('class', 'tooltip')
      .attr('width', 70)
      .attr('height', 100)
    //      .style('opacity', .0);
    ;


    vis.iconPath = (vis.data, d => {
      return "src/zodiac-icons/" + d.key.toLowerCase() + ".png";
    });
  }

  update() {
    let vis = this;

    vis.render();
  }

  render() {
    let vis = this;

    // Update view
    if (vis.data) {

      // We don't need Unknown in this vis
      if ("Unknown" in vis.data) {
        delete vis.data["Unknown"];
      }

      const nodes = d3.entries(vis.data);
      const entries = Object.entries(vis.data);

      vis.sizeScale = d3.scaleSqrt()
      // LOCAL DOMAIN BASED ON SELECTED COUNT TYPE
        .domain(d3.extent(nodes, d => d.value[vis.countType]))

      // GLOBAL DOMAIN
      //        .domain(
      //         d3.extent([].concat(nodes.map(d => d.value.numKillers), nodes.map(d => d.value.numProven), nodes.map(d => d.value.numPossible)))
      //      )
        .range([15, 60])
        .nice();

      // local min and max based on count type
      //      console.log("EXTENT: " + d3.extent(nodes, d => d.value[vis.countType]));
      //global min and max
      console.log("GLOBAL EXTENT: " + d3.extent([].concat(nodes.map(d => d.value.numKillers), nodes.map(d => d.value.numProven), nodes.map(d => d.value.numPossible))));

      let links = [];
      const filter = (vis.data, d => {
        return d.key != "root" && 
          !vis.elements.includes(d.key)});

      if (vis.isCyclicView) {
        nodes.forEach(d => {
          links.push({source: "root", target: d.key});
        });
      } else {
        nodes.forEach(d => {
          links.push({source: vis.signsInfoDict[d.key].type, target: d.key});
        });

        vis.elements.forEach(d => {
          nodes.push({key:d, value:[]});
          links.push({source: "root", target: d});
        });
      }

      nodes.push({key:"root", value:[]});

      let simulation;
      if (vis.isCyclicView) {
        simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d =>d.key).distance(200))
          .force("charge", d3.forceManyBody().strength(-500))
          .force("collide", d3.forceCollide().strength(1.5))
          .force("center", d3.forceCenter(vis.config.containerWidth / 2, vis.config.containerHeight / 2));
      } else {
        simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d =>d.key).distance(d => 80))
          .force("charge", d3.forceManyBody().strength(-1000))
          .force("collide", d3.forceCollide().strength(2))
          .force("center", d3.forceCenter(vis.config.containerWidth / 2, vis.config.containerHeight / 2))
          .force("forceX",d3.forceX().strength(0.07).x(vis.config.containerWidth / 2))
          .force("forceY", d3.forceY().strength(0.15).y(vis.config.containerHeight / 2));
      }

      const link = vis.links
      .selectAll("line")
      .data(links)
      .join("line");
      //      links.forEach(d => {
      //        console.log(d);
      //      })


      // icon image
      const image = vis.icons.selectAll('image')
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

      // Tooltip!
      const tooltipMouseover = (d) => {
        if (vis.isCyclicView) {
          vis.setPositions = false;
        }
        vis.OPTS.selectedSign = d.key;
        vis.tooltip.html(d.key)
          .style('left', (d3.event.pageX + 15) + "px")
          .style('top', (d3.event.pageY - 28) + "px")
          .transition()
          .style('opacity', .9); // started as 0!
      };

      const tooltipMouseout = (d) => {
        vis.tooltip.transition()
          .style('opacity', 0);
      };

      const node = vis.nodes
      .selectAll("circle")
      .data(nodes.filter(d => filter(d)))   
      .join("circle")
      .attr("id", d => d.key)
      .attr("class", d => vis.signsInfoDict[d.key].type)
      .attr("r", d => vis.sizeScale(d.value[vis.countType]))
      .call(vis.drag(simulation))
      .on('mouseover', d => tooltipMouseover(d))
      .on('mouseout', d => tooltipMouseout(d));

      if (vis.isCyclicView) {
        // fix the position of the root node
        const rootNode = simulation.nodes()[12];
        rootNode.fx= vis.config.containerWidth / 2;
        rootNode.fy= vis.config.containerHeight / 2;
      }

      simulation.on("tick", () => {
        node
          .attr("cx", d => {
          if (vis.setPositions && vis.isCyclicView) {
            d.x = vis.config.containerWidth / 2 +
              Math.round(215 * Math.cos(d.index * (2 * Math.PI / 12)));
          }
          return d.x;
        })
          .attr("cy", d => {
          if (vis.setPositions && vis.isCyclicView) {
            d.y =   vis.config.containerWidth / 2.2 +
              Math.round(215 * Math.sin(d.index * (2 * Math.PI / 12)));
          }
          return d.y;
        })

        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        image
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });
    }
  }

  registerSelectCallback(callback) {
    let vis = this;

    vis.OPTS.registerListener(callback);
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