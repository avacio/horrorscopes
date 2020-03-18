class ChoroplethMap {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 600,
    }

    this.year = _config.year;

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
      .attr('transform', 'translate(20,400), scale(0.8,0.8)');

    // We initialize a geographic path generator, that is similar to shape generators that you have used before (e.g. d3.line())
    // We define a projection: https://github.com/d3/d3-geo/blob/v1.11.9/README.md#geoAlbers
    vis.path = d3.geoPath().projection(d3.geoAlbers());
  }

  update() {
    let vis = this;

    // To-do: Add color scale
    let colorPalette = d3.schemeReds[9];

    this.colorScale = d3.scaleQuantile()
      .domain(this.domain)
      .range(colorPalette);

    this.curr_data = this.population.find(d => d.year == this.year);

    vis.render();
  }

  render() {
    let vis = this;

    // 
    let geoPath = vis.chart.selectAll('.geo-path')
    .data(topojson.feature(vis.canada_geo, vis.canada_geo.objects.provinces).features);

    let geoPathEnter = geoPath.enter().append('path')
    .attr('class', 'geo-path')
    .attr("d", vis.path);

    geoPath.merge(geoPathEnter)
      .transition()
      .attr('fill', d => {
      // To-do: Change fill to color code each province by its population
      return this.colorScale(this.curr_data[d.id]);
    });

    // To-do: Add labels for each province with the population value

    // draw labels
    vis.chart
      .selectAll("text")
      .data(topojson.feature(vis.canada_geo, vis.canada_geo.objects.provinces).features)
      .join("text")
      .attr("class", "place-text")
      .attr("x", d => { return vis.path.centroid(d)[0]; })
      .attr("y", d => { return vis.path.centroid(d)[1]; })
      .attr("text-anchor","middle")
      .text(d => d3.format(".2s")(this.curr_data[d.id]));
  }
}