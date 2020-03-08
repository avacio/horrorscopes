class DogHouse {


  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1500,
      containerHeight: _config.containerHeight || 1200,
    }

    this.data = _config.data;

    console.log("Init DogHouse");
    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g');

    vis.tooltip = d3.select('#visRow').append("div")
      .attr('class', 'tooltip')
      .attr('width', 70)
      .attr('height', 100)
      .style('opacity', .0);
  }

  update() {
    let vis = this;

    // If show-fate button is pressed, then sprites will change to show the dogs who died in action
    if (vis.showFate) {
      vis.imagePath = (vis.data, d => {
        let path = 'src/space-dog';
        path += (d.Gender == 'Female' ? '-yellow' : '-pink');
        path += (d.Fate.includes('Died') ? '-angel.png' : '.png');
        return path;
      });
    } else {
      vis.imagePath = (vis.data, d => (d.Gender == "Female" ? 'src/space-dog-yellow.png' : 'src/space-dog-pink.png'));
    }

    if (vis.data) {
      vis.numFlights = (vis.data, d => {return d.Flights ? d.Flights.split(',').length : 0});

      vis.sizeScale = d3.scaleSqrt()
        .domain(d3.extent(vis.data, d => vis.numFlights(d)))
        .range([60, 200])
        .nice();

      vis.render();
    }
  }

  render() {
    let vis = this;

    // render space dogs
    vis.chart.selectAll('image')
      .data(vis.data)
      .join('image')
      .attr('class', 'space-dog')
    // Rotation classes for "floating" animation
      .classed('rotateC0', (d,i) => vis.floatOn && i % 5)
      .classed('rotateC1', (d,i) => vis.floatOn && i % 7)
      .classed('rotateCC0', (d,i) => vis.floatOn && i % 6)
      .classed('rotateCC1', (d,i) => vis.floatOn && i % 4)
      .transition()
    // Get respective space dog sprite
      .attr("xlink:href", d => vis.imagePath(d))
      .attr("x", (d, i) => (i % 8) * 150 + 50)
      .attr("y",  (d, i) => i * 22 + 50)
    // Size of dog is based on the number of space missions they have been on
      .attr("width", d => vis.sizeScale(vis.numFlights(d)))
      .attr("height", d => vis.sizeScale(vis.numFlights(d)));


    // Tooltip!
    const tooltipMouseover = (d) => {
      vis.tooltip.html(d["Name (English)"] + '<br>' + d["Flights"] + '<br>' +d["Notes"])
        .style('left', (d3.event.pageX + 15) + "px")
        .style('top', (d3.event.pageY - 28) + "px")
        .transition()
        .style('opacity', .9); // started as 0!
    };

    const tooltipMouseout = (d) => {
      vis.tooltip.transition()
        .style('opacity', 0);
    };

    vis.chart.selectAll('.space-dog')
      .data(vis.data)
      .join('.space-dog')
      .on('mouseover', d => tooltipMouseover(d))
      .on('mouseout', d => tooltipMouseout(d));
  }
}