class Barchart {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 500,
      margin: _config.margin || { top: 50, right: 30, bottom: 100, left: 75 }
    }

    this.OPTS = {
      aInternal: "Aquarius",
      aListener: function(val) {},

      set highlightedSign(val) {
        if (this.aInternal == val) { return; }
        this.aInternal = val;
        this.aListener(val);
      },
      get highlightedSign() {
        return this.aInternal;
      },

      registerSelectListener: function(listener) {
        this.aListener = listener;
      }
    }

    this.selectedCountOption = "Number of Killers";
    this.sortOption = "Sign Order";

    this.initVis();
  }


  initVis() {
    let vis = this;

    vis.svg = d3.select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    // You need to adjust the margin config depending on the types of axis tick labels
    // and the position of axis titles (margin convetion: https://bl.ocks.org/mbostock/3019563)
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xAxisG = vis.chart.append('g')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart.append('g');
  }


  /**
   * This function contains all the code to prepare the data before we render it.
   * In some cases, you may not need this function but when you create more complex visualizations
   * you will probably want to organize your code in multiple functions.
   */
  update() {
    let vis = this;

    console.log(vis.selectedCountOption);
    console.log(vis.sortOption);

    // We don't need Unknown in this vis
    if ("Unknown" in vis.signsAndKills) {
      delete vis.signsAndKills["Unknown"];
    }

    vis.signsAndSelectedOption = {};
    vis.groupedBarsSelection = {};
    let orderedSigns = [];
    let unorderedSigns = Object.keys(vis.signsAndKills);
    let maxY = 0;

    // get max value for y
    unorderedSigns.forEach(sign => {
      if (maxY == 0)
      { 
        maxY = this.getY(vis.selectedCountOption, sign);
        vis.signsAndSelectedOption[sign]= maxY;
      } else
      { 
        let y = this.getY(vis.selectedCountOption, sign);
        vis.signsAndSelectedOption[sign] = y;

        if (y > maxY)
        {
          maxY = y;
        }
      }
    });

    // sort x values if sort option selected
    if (vis.sortOption == "Least to Most")
    { 
      orderedSigns = Object.keys(vis.signsAndSelectedOption).sort(function (a, b) {
        return d3.ascending(vis.signsAndSelectedOption[a], vis.signsAndSelectedOption[b]);
      });
    } else if (vis.sortOption == "Most to Least")
    {
      orderedSigns = Object.keys(vis.signsAndSelectedOption).sort(function (a, b) {
        return d3.descending(vis.signsAndSelectedOption[a], vis.signsAndSelectedOption[b]);
      });
    } else if (vis.sortOption == "Sign Order" || vis.sortOption == null)
    {
      orderedSigns = unorderedSigns;
    }    

    // create scale
    vis.xScale = d3.scaleBand()
      .domain(orderedSigns)
      .range([0, vis.width])
      .padding(0.5);

    vis.yScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([vis.height, 0])
      .nice();

    vis.xAxis = d3.axisBottom()
      .scale(vis.xScale);

    vis.yAxis = d3.axisLeft()
      .scale(vis.yScale);

    this.render(orderedSigns);
  }

  getY(selectedOption, sign)
  { 
    let vis = this;

    if (selectedOption == "Number of Killers" || selectedOption == null)
    { 
      return vis.signsAndKills[sign]['numKillers'];

    } else if (selectedOption == "Proven Kills")
    { 
      return vis.signsAndKills[sign]['numProven'];

    } else if (selectedOption == "Proven + Possible Kills")
    { 

      return (vis.signsAndKills[sign]['numPossible'] +
              vis.signsAndKills[sign]['numProven'])
    }
  }

  render(signs) {
    let vis = this;

    // clear state
    vis.chart.selectAll(".axis-label").remove();
    vis.chart.selectAll(".layerbar").remove();

    if(vis.selectedCountOption == "Proven + Possible Kills")
    { 
      vis.renderBars(signs);
      vis.renderGroupedBars(signs);
    } else {
      vis.renderBars(signs);
    }

    vis.xAxisG.call(vis.xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("font-size", 12)
      .style("text-anchor", "end")
      .style("fill", 'black');

    vis.xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 70)
      .attr('x', vis.width / 2)
      .text('Astrological Signs');

    vis.yAxisG.call(vis.yAxis)
      .selectAll("text")
      .style("font-size", 12)
      .style("fill", 'black');

    vis.yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', -50)
      .attr('x', -vis.height / 2)
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(vis.selectedCountOption);
  }

  renderBars(signs)
  { 
    let vis = this;
    console.log(vis.signsAndSelectedOption);
    // Bind data
    let bar = vis.chart.selectAll('.bar')
    .data(signs);

    // Append SVG rectangles for new data items
    let barEnter = bar.enter().append('rect')
    .attr("class", "bar");

    bar.merge(barEnter)
      .transition()
      .attr('id', function(d) { 
      return d;
    })
      .attr('x', d => vis.xScale(d))
      .attr('y', d => vis.yScale(vis.signsAndSelectedOption[d]))
      .attr('width', vis.xScale.bandwidth())
      .attr('height', d => vis.height - vis.yScale(vis.signsAndSelectedOption[d]));

    vis.chart.selectAll('.bar')
      .data(signs)
      .attr('fill', d => d == vis.OPTS.highlightedSign ? 'grey' : 'black')
      .on('mouseover', d => {
      vis.highlightBar(d)
    });

  }

  renderGroupedBars(signs) {
    let vis = this;

    vis.chart.selectAll('.layerbar')
      .data(signs)
      .join('rect')
      .transition()
      .attr('class', 'layerbar')
      .attr('id', function(d) { 
      return d + "layer";
    })
      .attr('x', d => vis.xScale(d))
      .attr('y', d => vis.yScale(vis.signsAndKills[d].numProven))
      .attr('width', vis.xScale.bandwidth())
      .attr('height', d => vis.height - vis.yScale(vis.signsAndKills[d].numProven))
      .attr('fill', d => d == vis.OPTS.highlightedSign ? '#b9b9b9' : '#8b0000');
  }

  highlightBar(sign) {
    let vis = this;
    let selectString = "#" + sign;
    let selectStringLayer = "#" + sign + "layer";
    vis.OPTS.highlightedSign = sign;

    let bars = vis.chart.selectAll('.bar');
    let layerBars = vis.chart.selectAll('.layerbar');

    bars
      .attr("fill", "black");

    layerBars
      .attr("fill", "#8b0000");

    let highlightBar = vis.chart.select(selectString);
    let highlightBarLayer = vis.chart.select(selectStringLayer);

    highlightBar
      .attr("fill", "grey");

    highlightBarLayer
      .attr("fill", "#b9b9b9");
  }

  registerSelectCallback(callback) {
    let vis = this;

    vis.OPTS.registerSelectListener(callback);
  }
}