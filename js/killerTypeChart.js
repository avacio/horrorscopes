class KillerTypeChart {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      svg: _config.svg,
      svg: _config.svg,
      containerWidth: _config.containerWidth || 1200,
      containerHeight: _config.containerHeight || 500,
      margin: _config.margin || { top: 30, right: 30, bottom: 100, left: 100 }
    }

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.svg = d3.select(vis.config.svg)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xAxisG = vis.chart.append('g')
      .attr('transform', `translate(0,${vis.height})`); 

    vis.yAxisG = vis.chart.append('g');

    vis.tooltip = d3.select(vis.config.parentElement)
      .append("div")
      .attr('class', 'tooltip')
      .attr('width', 70)
      .attr('height', 100);
  }

  update() {
    let vis = this;

    if (!vis.data) { return; }

    // clear state before appending
    vis.chart.selectAll("rect.normalized-bar").remove();
    vis.chart.selectAll(".axis-label").remove();

    vis.types = Object.keys(vis.data);

    // create scale
    vis.xScale = d3.scaleBand()
      .domain(vis.types)
      .range([0, vis.width])
      .padding(0.5);

    vis.yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([vis.height, 0])
      .nice();

    vis.xAxis = d3.axisBottom()
      .scale(vis.xScale);

    vis.yAxis = d3.axisLeft()
      .scale(vis.yScale)
      .tickFormat(d => d + "%")
      .ticks(4);

    vis.xAxisG.call(vis.xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("font-size", 14)
      .style("text-anchor", "end")
      .style("fill", 'black');

    vis.xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 90)
      .attr('x', vis.width / 2)
      .text('Serial Killer Types');

    vis.yAxisG.call(vis.yAxis)
      .selectAll("text")
      .style("font-size", 12)
      .style("fill", 'black');

    vis.yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('x', -vis.height / 2)
      .attr('y', -50)
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text('Distribution of Signs (%)');

    this.render();
  }

  render() {
    let vis = this;

    vis.renderBars();
  }

  renderBars()
  { 
    let vis = this;

    const tooltipMouseover = (d, name, yAndP) => {
      vis.tooltip.html(name + ' ' + yAndP[1]+'%'
                       + '<br>' + yAndP[3] + '/' + yAndP[2] +' killers')
        .style('left', (d3.event.pageX + 15) + "px")
        .style('top', (d3.event.pageY - 28) + "px")
        .transition()
        .style('opacity', .9); // started as 0!
    };

    const tooltipMouseout = (d) => {
      vis.tooltip.transition()
        .style('opacity', 0);
    };

    vis.types.forEach((type, index) => { 
      let signsObject = vis.data[vis.types[index]];
      let orderedSignedObject = {}

      if (vis.sortOption == "Most to Least")
      { 
        let signsArr = Object.keys(signsObject).sort(function (a, b) {
          // axis is flipped
          return d3.ascending(signsObject[a], signsObject[b]);
        });
        signsArr.forEach(s => { orderedSignedObject[s] = signsObject[s]; })
      } else if (vis.sortOption == "Least to Most")
      { 
        let signsArr = Object.keys(signsObject).sort(function (a, b) {
          // axis is flipped
          return d3.descending(signsObject[a], signsObject[b]);
        });
        signsArr.forEach(s => { orderedSignedObject[s] = signsObject[s]; })
      } else if (vis.sortOption == "Element Groups") {
        let signsArr = [];
        vis.elements.forEach(e => {
          signsArr.push(Object.keys(signsObject).filter(s => signsInfoDict[s].type === e))
        });

        signsArr.flat().forEach(s => { orderedSignedObject[s] = signsObject[s]; })
      } else {
        orderedSignedObject = signsObject;
      }

      let signValArray = Object.values(orderedSignedObject);

      for (let i = 0; i < signValArray.length; i++) {
        let yAndP = vis.getYandPercent(signValArray, i);
        let signName = Object.keys(orderedSignedObject)[i];

        let bar = vis.chart
        .append('rect')
        .attr('id', signName)
        .attr("class", vis.signsInfoDict[signName].type
              + " normalized-bar"
              // Uncomment below if you want the border strokes like the first network view
              //                          + " modality-" + vis.signsInfoDict[signName].modality
             )
        .attr('x', vis.xScale(type))
        .attr('y', vis.height - vis.yScale(yAndP[0]))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', vis.height - vis.yScale(yAndP[1]))
        .on('mouseover', d => tooltipMouseover(d, signName, yAndP))
        .on('mouseout', d => tooltipMouseout(d));
      }
    })
  }

  getYandPercent(arr, index) {
    let totalSum = arr.reduce((a, b) => a + b);    
    let percentage = Math.round(arr[index] / totalSum * 100);

    let i=0;
    let y=0;
    while (i < index) {
      y+= arr[i] / totalSum * 100;
      i++;
    }
    return [y , percentage, totalSum, arr[index]];
  }
}