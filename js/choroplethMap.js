class ChoroplethMap {
  
  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      onCountryClick: _config.onCountryClick,
      selectedCountry: _config.selectedCountry,
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

    this.drawColorLegend();

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

    vis.killerTooltip = d3.select('#killer-tooltip')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('font-size', '10px')
      .style('opacity', 0);

    // store randomly generated points for the serial killers
    vis.generatedPointsByCountry = []; 
  }

  update() {
    let vis = this;
    // To-do: Add color scale
    vis.colorScale = d3.scaleThreshold()
      .domain([1, 5, 15, 50, 100])
      .range(d3.schemeReds[6]);

    // To-do: Select data for specific year (could be done in task1.js too)

    vis.render();
  }

  stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }

  reset() {
    let vis = this;

    vis.active.classed("active", false);
    vis.active = d3.select(null);
    //vis.config.onCountryClick(null);

    vis.svg.transition()
        .duration(750)
        .call( vis.zoom.transform, d3.zoomIdentity ); 
  }

  render() {
    let vis = this;

    console.log(selectedCountry);

    vis.zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [1200, 700]])
      .on('zoom', function() {
          vis.chart.selectAll('path')
           .attr('transform', d3.event.transform);

          vis.chart.selectAll('text')
           .attr('transform', d3.event.transform); 

          vis.chart.selectAll('circle')
            .attr('transform', d3.event.transform);
    });

    // uncomment for manual zoom  
    //vis.svg.call(vis.zoom);

    var getRandomPoint = function(d) {
      var boundingBox = d3.geoBounds(d),
          minCoordinates = boundingBox[0],
          maxCoordinates = boundingBox[1],
          minLong = minCoordinates[0],
          minLat = minCoordinates[1],
          maxLong = maxCoordinates[0],
          maxLat = maxCoordinates[1];

      var randLat = minLat + (Math.random() * (maxLat - minLat)),
          randLong = minLong + (Math.random() * (maxLong - minLong));

      // The point must be specified as a two-element array [longitude, latitude] in degrees
      var randPoint = [randLong, randLat];

/*
      console.log("long min: " + minLong + " long max: " + maxLong);
      console.log("lat min: " + minLat + " lat max: " + maxLat);
      
      console.log(randPoint);

      console.log(d3.geoContains(d, randPoint));*/

      var isPointInCountry = d3.geoContains(d, randPoint);
      
      // recurse until a point within the country is generated
      if (isPointInCountry) {
        return randPoint;
      } else {
        return getRandomPoint(d);
      }
      /*    
      console.log("random lat: " + lat);
      console.log("random long: " + long);
      console.log(minCoordinates);
      console.log(maxCoordinates);
      console.log(minLong);
      console.log(minLat);
      console.log(maxLong);
      console.log(maxLat);*/
    }

    // referenced: https://bl.ocks.org/piwodlaiwo/90777c94b0cd9b6543d9dfb8b5aefeef  
    var clicked = function(d) {
      // callback for index.js
      //console.log(d.properties.name);
      //vis.config.onClickedCountry(d);


      //[[left, bottom], [right, top]], 
      // where left is the minimum longitude, bottom is the minimum latitude, 
      // right is maximum longitude, and top is the maximum latitude.
      //console.log(d3.geoBounds(d));

      if (vis.killersByCountry[d.properties.name] == 0) return;

      console.log("clicked: " + selectedCountry);

      if (vis.active.node() === this) {
        vis.generatedPointsByCountry = [];
        vis.config.onCountryClick(null);

        // reset zoom

        var killers = document.getElementsByClassName('killer');
        console.log(killers);
        while(killers[0]) {
          killers[0].parentNode.removeChild(killers[0]);
        }

        //destroy killers
        /*
        var killers = document.getElementsByClassName('.killer');

        while(killers[0]) {
            killers[0].parentNode.removeChild(killers[0]);
        }​*/

        return vis.reset();
      }

      console.log(d);
      console.log(vis.killersByCountry);

      var numKillersinCountry = vis.killersByCountry[d.properties.name];
      console.log(numKillersinCountry);
      // generate X points for how many killers a country has
      /*if (vis.generatedPointsByCountry.includes(point)) {

      }*/

      for (let i = 0; i < vis.killersByCountry[d.properties.name]; i++) {
        var point = getRandomPoint(d);

        vis.generatedPointsByCountry.push(point);
      }

      // callback for selectedCountry
      vis.config.onCountryClick(d.properties.name);

      // zoom into country
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

    // country mouseover event handler
    var countryMouseover = function(d) {
      vis.tooltip
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY - 20) + 'px')
        .style('opacity', d => {
          if (selectedCountry != null) {
            return '0';
          } else {
            return '1';
          }
        });

      if (vis.killersByCountry[d.properties.name] != 0) {
        vis.tooltip
          .html('<p>' + d.properties.name + ': ' + vis.killersByCountry[d.properties.name] + ' killer(s)</p>');
      } else {
        vis.tooltip
          .html('<p>' + d.properties.name + ' has no killers</p>');
      }
    }

    // country mouseout event handler
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

    //console.log(vis.active);

    vis.geoPath.merge(vis.geoPathEnter)
      .transition()
        .attr('fill', d => {
          return vis.colorScale(vis.killersByCountry[d.properties.name]);
        })
        .attr('opacity', d => {
           //console.log(selectedCountry);
            if (selectedCountry != null) {
              if (d.properties.name == selectedCountry) {
                return '1';
              } else {
                return '0.2';
              }
            }
        })
        .attr('cursor', d => {
          if (selectedCountry != null) {
            if (d.properties.name == selectedCountry) {
              return 'pointer';
            } else {
              return 'default';
            }
          } else if (vis.killersByCountry[d.properties.name] != 0) {
            return 'pointer';
          } else {
            return 'default';
          }
        });

    //var point = getRandomPoint(d);

    // to-do: generate points for each individual serial killer
    if (selectedCountry != null) {

      // parse data to only show ones from the selected country
      var filterKillersByCountry = vis.serialKillersData.filter(function (d) {
        if (selectedCountry == "United States of America") {
          return d.CountriesActive.includes("United States");
        } else {
          return d.CountriesActive.includes(selectedCountry);
        }
        //console.log(d);
      });


      // add lat/lon coordinates to filtered killers from generatedPointsByCoutry
      for (let i = 0; i < filterKillersByCountry.length; i++) {
        filterKillersByCountry[i]["long"] = vis.generatedPointsByCountry[i][0];
        filterKillersByCountry[i]["lat"] = vis.generatedPointsByCountry[i][1];

        //console.log(vis.generatedPointsByCountry[i]);
      }

      // country mouseover event handler
      var killerMouseover = function(d) {
        vis.killerTooltip
          .html("<div class='killer-notes' style='max-width: 400px;'>" + 
            "<p>Name: " + d.Name + "</p>" + 
            "<p>Nickname(s): " + d.Nickname + "</p>" +
            "<p>Birthday: " + d.Birthday + "</p>" +
            "<p>Type(s) of Killer: " + d.Type + "</p>" + 
            "<p>Country/Countries Active: " + d.CountriesActive + "</p>" +
            "<p>Year(s) Active: " + d.YearsActive + "</p>" +
            "<p>Possible Victims: " + d.PossibleVictims + "</p>" + 
            "<p>Proven Victims: " + d.ProvenVictims + "</p>" + 
            "<p>Notes: " + d.Notes
            + "</p>")
          .style('left', (d3.event.pageX + 20) + 'px')
          .style('top', (d3.event.pageY - 20) + 'px')
          .style('opacity', 1)
          .style('display', 'inline');
      }

      // country mouseout event handler
      var killerMouseout = function(d) {
        vis.killerTooltip
          .style('opacity', 0)
          .style('display', 'none'); 
      }

      // add serial killers to the map
      vis.circles = vis.chart.selectAll('circle')
      .data(filterKillersByCountry);

      vis.circles.enter().append('circle')
        .attr('class', 'killer')
        .on('mouseover', killerMouseover)
        .on('mouseout', killerMouseout)
        .merge(vis.circles)
          .attr('cx', d => {
            return vis.projection([d.long, d.lat])[0];
          })
          .attr('cy', d => {
            return vis.projection([d.long, d.lat])[1];
          })
          .attr('r', '1.5')
          .style('fill-opacity', '0.5'); 
    }
  }

  drawColorLegend() {
    let vis = this;

    vis.colorLegend = d3.select("#map-legend")

    //.domain([1, 5, 15, 50, 100, 200])
    // title
    vis.colorLegend.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text("Killers per Country")
      .style("font-size", "14px")
      //.attr("alignment-baseline","middle")

    //0 killers
    vis.colorLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", 50)
      .attr("r", 6)
      .style("fill", "rgb(254, 229, 217)")
    vis.colorLegend.append("text")
      .attr("x", 40)
      .attr("y", 50)
      .text("0")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

    // 1 - 4 killers 
    vis.colorLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", 80)
      .attr("r", 6)
      .style("fill", "rgb(252, 187, 161)")
    vis.colorLegend.append("text")
      .attr("x", 40)
      .attr("y", 80)
      .text("1 - 4")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

    // 5 - 14 killers
    vis.colorLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", 110)
      .attr("r", 6)
      .style("fill", "rgb(252, 146, 114)")
    vis.colorLegend.append("text")
      .attr("x", 40)
      .attr("y", 110)
      .text("5 - 14")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

    // 15 - 49 killers  
    vis.colorLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", 140)
      .attr("r", 6)
      .style("fill", "rgb(251, 106, 74)")
    vis.colorLegend.append("text")
      .attr("x", 40)
      .attr("y", 140)
      .text("15 - 49")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

    // 50 - 99 killers  
    vis.colorLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", 170)
      .attr("r", 6)
      .style("fill", "rgb(239, 59, 44)")
    vis.colorLegend.append("text")
      .attr("x", 40)
      .attr("y", 170)
      .text("50 - 99")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")

    // 100+ killers  
    vis.colorLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", 200)
      .attr("r", 6)
      .style("fill", "rgb(165, 15, 21)")
    vis.colorLegend.append("text")
      .attr("x", 40)
      .attr("y", 200)
      .text("100+")
      .style("font-size", "12px")
      .attr("alignment-baseline","middle")
  }
}
