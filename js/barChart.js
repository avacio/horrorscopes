class Barchart {

    constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 700,
      containerHeight: _config.containerHeight || 500,
      margin: _config.margin || { top: 50, right: 30, bottom: 100, left: 100 }
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
  update(selectedOption) {
    let vis = this;

    // We don't need Unknown in this vis
    if ("Unknown" in vis.signsAndKills || "Unknown" in vis.signsAndSerialKillers) {
        delete vis.signsAndKills["Unknown"];
        delete vis.signsAndSerialKillers["Unknown"];
    }

    vis.signsAndSelectedOption = {};
    let signs = Object.keys(vis.signsAndKills);
    let maxY = 0;
 

    // get max value for y
    signs.forEach(sign => {
      if (maxY == 0)
      { 
        maxY = this.getY(selectedOption, sign);
        vis.signsAndSelectedOption[sign]= maxY;
        
      } else
      { 
        let y = this.getY(selectedOption, sign);
        vis.signsAndSelectedOption[sign] = y;

        if (y > maxY)
        {
          maxY = y;
        }
      }
    });


    // create scale
    vis.xScale = d3.scaleBand()
      .domain(signs)
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

    this.render();
  }

  getY(selectedOption, sign)
  { 
      let vis = this;

      if (selectedOption == "Number of Killers" || selectedOption == null)
      { 
        return vis.signsAndSerialKillers[sign].length;

      } else if (selectedOption == "Proven Kills")
      {
        return vis.signsAndKills[sign]['total confirmed kills'];

      } else if (selectedOption == "Proven + Possible Kills")
      { 
        return (vis.signsAndKills[sign]['total confirmed kills'] +
                        vis.signsAndKills[sign]['total possible kills'])
      }
  }

  render() {
    let vis = this;

    console.log(vis.signsAndSelectedOption);

     // Bind data
    let bar = vis.chart.selectAll('rect')
        .data(signs);
  
    // Append SVG rectangles for new data items
    let barEnter = bar.enter().append('rect');

    // Merge will update the attributes x, y, width, and height on both the "enter" and "update"
    // selection (i.e. define attributes for new data items and update attributes for existing items).
    // We use the chained transition() function to create smooth transitions whenever attributes change. 
    bar.merge(barEnter)
      .transition()
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
}