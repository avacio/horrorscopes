class KillerTypeChart {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      svg: _config.svg,
      svg: _config.svg,
      containerWidth: _config.containerWidth || 1200,
      containerHeight: _config.containerHeight || 500,
//      margin: _config.margin || { top: 50, right: 30, bottom: 100, left: 50 }
      margin: _config.margin || { top: 30, right: 30, bottom: 100, left: 100 }
    }

    this.initVis();
  }


  initVis() {
    let vis = this;

    vis.svg = d3.select(vis.config.svg)
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

    vis.tooltip = d3.select(vis.config.parentElement)
      .append("div")
      .attr('class', 'tooltip')
      .attr('width', 70)
      .attr('height', 100);
  }


  /**
   * This function contains all the code to prepare the data before we render it.
   * In some cases, you may not need this function but when you create more complex visualizations
   * you will probably want to organize your code in multiple functions.
   */
  update() {
    let vis = this;

    if (!vis.data) { return; }
    //
    //    console.log(vis.selectedCountOption);
    //    console.log(vis.sortOption);

    // clear state
    vis.chart.selectAll("rect.normalized-bar").remove();
    vis.chart.selectAll(".axis-label").remove();

    //    vis.signsAndSelectedOption = {};
    //    vis.groupedBarsSelection = {};
    //    let orderedSigns = [];
    //    let unorderedSigns = Object.keys(vis.signsAndKills);
    //    let maxY = 0;
    vis.types = Object.keys(vis.data);
    console.log(vis.types)
    //    console.log(vis.signsAndKills);

    //    // get max value for y
    //    unorderedSigns.forEach(sign => {
    //      if (maxY == 0)
    //      { 
    //        maxY = this.getY(vis.selectedCountOption, sign);
    //        vis.signsAndSelectedOption[sign]= maxY;
    //        
    //
    //      } else
    //      { 
    //        let y = this.getY(vis.selectedCountOption, sign);
    //        vis.signsAndSelectedOption[sign] = y;
    //
    //        if (y > maxY)
    //        {
    //          maxY = y;
    //        }
    //      }
    //    });

    //    // sort x values if sort option selected
    //    if (vis.sortOption == "Least to Most")
    //    { 
    //
    //      orderedSigns = Object.keys(vis.signsAndSelectedOption).sort(function (a, b) {
    //        return d3.ascending(vis.signsAndSelectedOption[a], vis.signsAndSelectedOption[b]);
    //      });
    //
    //
    //    } else if (vis.sortOption == "Most to Least")
    //    {
    //
    //      orderedSigns = Object.keys(vis.signsAndSelectedOption).sort(function (a, b) {
    //        return d3.descending(vis.signsAndSelectedOption[a], vis.signsAndSelectedOption[b]);
    //      });
    //
    //    } else if (vis.sortOption == "Sign Order" || vis.sortOption == null)
    //    {
    //      orderedSigns = unorderedSigns;
    //    }    


    // create scale
    vis.xScale = d3.scaleBand()
      .domain(vis.types)
      .range([0, vis.width])
    //      .padding(0.5);
      .padding(0.5);

    vis.yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([vis.height, 0])
      .nice();

    vis.xAxis = d3.axisBottom()
      .scale(vis.xScale);

    vis.yAxis = d3.axisLeft()
      .scale(vis.yScale)
      .tickFormat(d => d + "%");

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
//      .attr('x', vis.width / 2)
      .attr('y', -50)
      .attr('x', -vis.height / 2)
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text('Distribution of Signs (%)');

    //    const yAxisG = vis.chart.append('g').call(yAxis)
    //    .attr('class', 'yAxisG');
    //    yAxisG.selectAll('.domain').remove();
    //    yAxisG.append('text')
    //      .attr('class', 'axis-label')
    //      .attr('y', -50)
    //      .attr('x', -vis.height / 2)
    //      .attr('transform', `rotate(-90)`)
    //      .attr('text-anchor', 'middle')
    //      .text(vis.yAxisLabel);

    this.render();
  }

  render() {
    let vis = this;

    vis.renderBars();
  }

  renderBars()
  { 
    let vis = this;


    //    var dataset = d3.layout.stack()(["redDelicious", "mcintosh", "oranges", "pears"].map(function(fruit) {
    //  return data.map(function(d) {
    //    return {x: parse(d.year), y: +d[fruit]};
    //  });
    //}));

    // Bind data
    //    let bar = vis.chart.selectAll('.bar')
    ////    .data(vis.types);
    //    .data(vis.data[vis.types[0]]);
    //
    //    // Append SVG rectangles for new data items
    //    let barEnter = bar.enter().append('rect')
    //    .attr("class", "bar");
    //
    //    bar.merge(barEnter)
    //      .transition()
    //      .attr('id', d => d)
    ////      .attr('x', d => vis.xScale(d))
    //      .attr('x', d => vis.xScale(0))
    //      .attr('y', d => vis.yScale(d))
    //      .attr('width', vis.xScale.bandwidth())
    //    //      .attr('height', d => vis.height - vis.yScale(vis.data[d][0])
    //      .attr('height', d =>100
    //           );
    // Tooltip!
    //    const tooltipMouseover = (name, percentage, sum) => {
    //    const tooltipMouseover = (name, xPosn, yAndP) => {
    //    const tooltipMouseover = (d) => {
    const tooltipMouseover = (d, name, yAndP) => {
      //        vis.highlightNode(d.key);

      vis.tooltip.html(name + ' ' + yAndP[1]+'%'
                       + '<br>' + yAndP[3] + '/' + yAndP[2] +' killers')
        .style('left', (d3.event.pageX + 15) + "px")
        .style('top', (d3.event.pageY - 28) + "px")
      //            .style("left", d3.select(this).attr("x") + "px")     
      //        .style("top", d3.select(this).attr("y") + "px")
      //            .style("left", (window.pageXOffset + matrix.e + 15) + "px")
      //              .style("top", (window.pageYOffset + matrix.f - 30) + "px")
      //                  .style("left", (window.pageXOffset + 15) + "px")
      //              .style("top", (window.pageYOffset - 30) + "px")
        .transition()
        .style('opacity', .9); // started as 0!
    };

    vis.types.forEach((type, index) => { 


      //////////////////////////////////
      // sort x values if sort option selected
      //    if (vis.sortOption == "Least to Most")
      //    { 
      //
      //      orderedSigns = Object.keys(vis.signsAndSelectedOption).sort(function (a, b) {
      //        return d3.ascending(vis.signsAndSelectedOption[a], vis.signsAndSelectedOption[b]);
      //      });
      //
      //
      //    } else 
      //      if (vis.sortOption == "Most to Least")
      //      { 
      //        orderedSigns = Object.keys(vis.signsAndSelectedOption).sort(function (a, b) {
      //        return d3.descending(vis.signsAndSelectedOption[a], vis.signsAndSelectedOption[b]);
      //      });
      //

      //
      //      orderedSigns = Object.keys(vis.signsAndSelectedOption).sort(function (a, b) {
      //        return d3.descending(vis.signsAndSelectedOption[a], vis.signsAndSelectedOption[b]);
      //      });
      //
      //    } else if (vis.sortOption == "Sign Order" || vis.sortOption == null)
      //    {
      //      orderedSigns = unorderedSigns;
      //    }    
      //
      //      
      //      


      ///////////////////////////////////////////
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
        //              vis.getYandPercent(vis.data[vis.types[index]], i);
        let yAndP = vis.getYandPercent(signValArray, i);
        let signName = Object.keys(orderedSignedObject)[i];

        let bar = vis.chart
        .append('rect')
        .attr('id', signName)
        .attr("class", vis.signsInfoDict[signName].type
              + " normalized-bar"
              //            + " modality-" + vis.signsInfoDict[signName].modality
             )
        .attr('x', vis.xScale(type))
        .attr('y', vis.height - vis.yScale(yAndP[0]))
        .attr('width', vis.xScale.bandwidth())
        .attr('height', vis.height - vis.yScale(yAndP[1]))
        .on('mouseover', d => tooltipMouseover(d, signName, yAndP));

        //        bar                              .on('mouseover', ()=> console.log("TET"))

        //            .attr('height', vis.height-vis.yScale(yAndP[1]));

      }
      //      Object.values(vis.data[vis.types[index]]).forEach((entry) => {
      //        console.log("ENTRY: " + entry)
      //      })

      //      console.log(vis.data[vis.types[index]])

      //        let bar = vis.chart.selectAll('.bar ' + type)
      ////    .data(vis.types);
      //    .data(vis.data[vis.types[index]]);

      //    // Append SVG rectangles for new dssssssata items
      //    let barEnter = bar.enter().append('rect')
      //    .attr("class", "bar");
      //
      //    bar.merge(barEnter)
      //      .transition()
      //      .attr('id', d => d)
      ////      .attr('x', d => vis.xScale(d))
      //      .attr('x', d => vis.xScale(index))
      //      .attr('y', (d, i) => {
      //      vis.getY(d, i);
      //      
      //      vis.yScale(vis.getY(d, i))})
      //      .attr('width', vis.xScale.bandwidth())
      //    //      .attr('height', d => vis.height - vis.yScale(vis.data[d][0])
      //      .attr('height', d =>100
      //           );
      //      

      //            console.log(vis.data[vis.types[index]])
      //    // Append SVG rectangles for new dssssssata items
      //    let barEnter = bar.enter().append('rect')
      //    .attr("class", "bar");
      //
      //    bar.merge(barEnter)
      //      .transition()
      //      .attr('id', d => d)
      ////      .attr('x', d => vis.xScale(d))
      //      .attr('x', d => vis.xScale(index))
      //      .attr('y', (d, i) => {
      //      vis.getY(d, i);
      //      
      //      vis.yScale(vis.getY(d, i))})
      //      .attr('width', vis.xScale.bandwidth())
      //    //      .attr('height', d => vis.height - vis.yScale(vis.data[d][0])
      //      .attr('height', d =>100
      //           );
      //      
    })

    //    vis.chart.selectAll('.bar')
    //      .data(vis.data)
    //      .on('mouseover', d => {
    //      vis.highlightBar(d)
    //    });

  }



  highlightBar(sign) {
    let vis = this;
    let selectString = "#" + sign;
    let selectStringLayer = "#" + sign + "layer";
    vis.OPTS.highlightedSign = sign;

    // clear all bars first
    let bars = vis.chart.selectAll('.bar');
    let layerBars = vis.chart.selectAll('.layerbar');

    bars
      .attr("fill", "black");

    layerBars
      .attr("fill", "steelblue");

    let highlightBar = vis.chart.select(selectString);
    let highlightBarLayer = vis.chart.select(selectStringLayer);

    highlightBar
      .attr("fill", "grey");

    highlightBarLayer
      .attr("fill", "grey");

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
    //    console.log("totalSum," + totalSum)
    //
    //    console.log('val: ' + arr[index])
    //    console.log('y: ' + y)
    //    console.log('%: ' + percentage)

    return [y , percentage, totalSum, arr[index]];
  }
}