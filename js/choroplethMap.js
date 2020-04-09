class ChoroplethMap {
  
  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1200,
      containerHeight: _config.containerHeight || 700,
    }

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.width = 1200,
    vis.height = 700,
    vis.active = d3.select(null);

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
      .attr('transform', 'translate(100, 0)');
        //.attr('transform', 'translate(20,50), scale(1.2,1.2)');
        //.attr('transform', 'translate(300,300), scale(0.2,0.2)');

    // We initialize a geographic path generator, that is similar to shape generators that you have used before (e.g. d3.line())
    // We define a projection: https://github.com/d3/d3-geo/blob/v1.11.9/README.md#geoAlbers

    //vis.projection = d3.geoNaturalEarth1();
    vis.projection = d3.geoEquirectangular()
      .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
      .scale([vis.config.containerWidth / (2 * Math.PI)]) // scale to fit group width
      .translate([vis.config.containerWidth / 2, vis.config.containerHeight / 2]) // ensure centred in group
    ;

    const pathGenerator = d3.geoPath().projection(vis.projection);

    vis.path = pathGenerator;

    // outline for the world
    vis.chart.append('path')
      .attr('class', 'world-sphere')
      .attr('d', pathGenerator({type: 'Sphere'}));

    // initiate tool tip
    // Referenced: http://bl.ocks.org/williaster/af5b855651ffe29bdca1
    vis.tooltip = d3.select('#map-tooltip')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('font-size', '12px')
      .style('opacity', 0);


  }

  update() {
    let vis = this;
    // To-do: Add color scale
    vis.colorScale = d3.scaleThreshold()
      .domain([1, 5, 15, 50, 100, 200])
      .range(d3.schemeReds[7]);

    // To-do: Select data for specific year (could be done in task1.js too)

    vis.render();
  }

  clicked(d) {
    let vis = this;

    if (vis.active.node() === this) return reset();
    vis.active.classed("active", false);
    vis.active = d3.select(vis).classed("active", true);

    var bounds = vis.path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / vis.width, dy / vis.height))),
        translate = [vis.width / 2 - scale * x, vis.height / 2 - scale * y];

    vis.svg.transition()
        .duration(750)
        .call( vis.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); 
  }

  stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }

  reset() {
    let vis = this;

    vis.active.classed("active", false);
    vis.active = d3.select(null);

    vis.svg.transition()
        .duration(750)
        .call( vis.zoom.transform, d3.zoomIdentity ); 
  }

  render() {
    let vis = this;

    vis.zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [1200, 700]])
      .on('zoom', function() {
          vis.chart.selectAll('path')
           .attr('transform', d3.event.transform);

          vis.chart.selectAll('text')
           .attr('transform', d3.event.transform); 
    });

    //vis.svg.call(vis.zoom);

    vis.svg.append("rect")
      .attr("class", "background")
      .attr("display", "none")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight)
      .on("click", this.reset());

    var clicked = function(d) {
      if (vis.killersByCountry[d.properties.name] == 0) return;
      if (vis.active.node() === this) return vis.reset();

      vis.active.classed("active", false);
      vis.active = d3.select(this).classed("active", true);

      var bounds = vis.path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / vis.width, dy / vis.height))),
          translate = [vis.width / 2 - scale * x, vis.height / 2 - scale * y];

      vis.svg.transition()
          .duration(750)
          .call( vis.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
    }

    // mouseover event handler
    var countryMouseover = function(d) {
      vis.tooltip
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('opacity', 1);

      if (vis.killersByCountry[d.properties.name] != 0) {
        vis.tooltip
          .html('<p>' + d.properties.name + ': ' + vis.killersByCountry[d.properties.name] + ' killer(s)</p>');
      } else {
        vis.tooltip
          .html('<p>' + d.properties.name + ' has no killers</p>');
      }
    }

    // mouseout event handler
    var countryMouseout = function(d) {
      vis.tooltip
        .style('opacity', 0); 
    }

    vis.geoPath = vis.chart.selectAll('.geo-path')
        .data(topojson.feature(vis.world_geo, vis.world_geo.objects.countries).features);

    vis.geoPathEnter = vis.geoPath.enter().append('path')
        .attr('class', 'geo-path')
        .attr("d", vis.path)
        .on('mouseover', countryMouseover)
        .on('mouseout', countryMouseout)
        .on('click', clicked);

    console.log(vis.active);

    vis.geoPath.merge(vis.geoPathEnter)
      .transition()
        .attr('fill', d => {
          return vis.colorScale(vis.killersByCountry[d.properties.name]);

/*
          if (vis.active._parents[0] == null) {
            return vis.colorScale(vis.killersByCountry[d.properties.name]);
          } else {
            return 'blue';
          }
          

          /*
          if (vis.killersByCountry[d.properties.name] != 0) {
            return '#3b5d38';
          } else {
            return '#D3D3D3';
          }*/
          // To-do: Change fill to color code each province by its population
        })
        .attr('opacity', d => {
          //console.log(vis.active.node());
        })
        .attr('cursor', d => {
          if (vis.killersByCountry[d.properties.name] != 0) {
            return 'pointer';
          } else {
            return 'default';
          }
        });

    // To-do: Add labels for each province with the population value
    /*let geoLabels = vis.chart.selectAll('.geo-labels')
        .data(topojson.feature(vis.world_geo, vis.world_geo.objects.countries).features); 

    let geoLabelsEnter = geoLabels.enter().append('text')
      .attr('class', 'geo-labels');

    //console.log(vis.data);  

    geoLabels.merge(geoLabelsEnter)
      .attr("x", d => vis.projection(d3.geoCentroid(d))[0])
      .attr("y", d => vis.projection(d3.geoCentroid(d))[1])
      .attr("class", "place-text")
      .attr("text-anchor","middle")
      .text(d => {
        if (vis.killersByCountry[d.properties.name] != 0) {
          return vis.killersByCountry[d.properties.name];
        }
      });  */
  }
}




/*
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
*/
