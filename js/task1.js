
// Initialize chart
let choroplethMap = new ChoroplethMap({ parentElement: '#map',
                                       year: $("#year-slider").val()});

// Load data
Promise.all([
  d3.json('data/canada_provinces.topo.json'),
  d3.csv('data/canada_historical_population.csv')
]).then(files => {
  let population = files[1];

  // initialize global minimum and maximum to stub values
  let globalMin = population[0]["Nunavut"];
  let globalMax = 0;

  // Change all values to numbers
  population.forEach(d => {
    const columns = Object.keys(d)
    for (const col of columns) {
      d[col] = +d[col];

      if (col !== "year") {
        if (globalMin > d[col]) { globalMin = d[col]; }
        if (globalMax < d[col]) { globalMax = d[col]; }
      } 
    }
  });

  console.log("Global min: " + globalMin + ", Global max: " + globalMax);

  choroplethMap.canada_geo = files[0];
  choroplethMap.population = population;
  choroplethMap.domain = [globalMin, globalMax];
  choroplethMap.update();
});


// To-do: Listen to UI events

$("#year-slider").on("change", onYearSlider);
$("#year-slider").on("input", onYearSlider);

function onYearSlider() {
  year = $(this).val();

  $("#year-selection").text(year);
  choroplethMap.year = year;
  choroplethMap.update();
};

var interval;
$("#play-button").on("click", function() {
  text = $(this).text();

  if (text == "Play") {
    interval = setInterval(() => {
      $("#year-slider").val(parseInt($("#year-slider").val())+1);
      $("#year-slider").trigger('change');

      // Clear interval when animation has reached final year
      if ($("#year-slider").val() == $("#year-slider").prop('max')) {
        clearInterval(interval);
        $(this)[0].innerHTML = "Play";
      }
    }, 500);

  } else {
    clearInterval(interval);
  }

  // Update button label
  $(this)[0].innerHTML = (text == "Play" ? "Pause" : "Play");
});