class KillerTypeChart {

    constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 500,
      margin: _config.margin || { top: 50, right: 30, bottom: 100, left: 50 }
    }

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

  registerSelectCallback(callback) {
    let vis = this;
    vis.OPTS.registerListener(callback);
  }


  render(signs) {
    let vis = this;

     // Bind data
    let bar = vis.chart.selectAll('.bar')
        .data(signs);
  
    // Append SVG rectangles for new data items
    let barEnter = bar.enter().append('rect')
        .attr("class", "bar");

    // Merge will update the attributes x, y, width, and height on both the "enter" and "update"
    // selection (i.e. define attributes for new data items and update attributes for existing items).
    // We use the chained transition() function to create smooth transitions whenever attributes change. 
    bar.merge(barEnter)
      .transition()
        .attr('id', function(d) { 
            return d;
         })
        .attr('x', d => vis.xScale(d))
        .attr('y', d => vis.yScale(vis.signsAndSelectedOption[d]))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', d => vis.height - vis.yScale(vis.signsAndSelectedOption[d]));

    vis.xAxisG.call(vis.xAxis)
      .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("font-size", 12)
        .style("text-anchor", "end")
        .style("fill", 'black');

    vis.yAxisG.call(vis.yAxis)
      .selectAll("text")
        .style("font-size", 12)
        .style("fill", 'black');
  }

  highlightBar(sign) {
    let vis = this;
    let selectString = "#" + sign;

    // clear all bars first
    let bars = vis.chart.selectAll('.bar');

    bars
      .attr("fill", "black");

    let highlightBar = vis.chart.select(selectString);

    highlightBar
      .attr("fill", "grey");

  }

}