let highlightedSign = "Aquarius";
let formatTime = d3.timeFormat("%m/%d");

let barChart = new Barchart({ parentElement: '#bar-chart'});
let choroplethMap = new ChoroplethMap({ parentElement: '#map' });
let zodiacCycle = new ZodiacCycle({ parentElement: '#vis-row', svg: "#vis-nodes" });
let killerTypeChart = new KillerTypeChart({ parentElement: '#killer-type-chart'});

let astrologySignsData = {
  "Aquarius": d3.timeDay.range(new Date(0000, 0, 20), new Date(0000, 1, 18), 1), 
  "Pisces": d3.timeDay.range(new Date(0000, 1, 19), new Date(0000, 2, 20), 1),
  "Aries": d3.timeDay.range(new Date(0000, 2, 21), new Date(0000, 3, 19), 1),
  "Taurus": d3.timeDay.range(new Date(0000, 3, 21), new Date(0000, 4, 20), 1),
  "Gemini": d3.timeDay.range(new Date(0000, 4, 21), new Date(0000, 5, 20), 1),
  "Cancer": d3.timeDay.range(new Date(0000, 5, 21), new Date(0000, 6, 22), 1),
  "Leo": d3.timeDay.range(new Date(0000, 6, 23), new Date(0000, 7, 22), 1),
  "Virgo": d3.timeDay.range(new Date(0000, 7, 23), new Date(0000, 8, 22), 1),
  "Libra": d3.timeDay.range(new Date(0000, 8, 23), new Date(0000, 9, 22), 1),
  "Scorpio": d3.timeDay.range(new Date(0000, 9, 23), new Date(0000, 10, 21), 1),
  "Sagittarius": d3.timeDay.range(new Date(0000, 10, 22), new Date(0000, 11, 21), 1),
  "Capricorn": d3.timeDay.range(new Date(0000, 11, 22), new Date(0001, 0, 20), 1)
}

const elements = ["fire", "earth", "air", "water"];
let signsInfoDict = {};

// CONSTANTS FOR DATA MAPPINGS TO BE LOADED HERE
let signsAndSerialKillers = {
  "Aquarius": [],
  "Pisces": [],
  "Aries": [],
  "Taurus": [],
  "Gemini": [],
  "Cancer": [],
  "Leo": [],
  "Virgo": [],
  "Libra": [],
  "Scorpio": [],
  "Sagittarius": [],
  "Capricorn": [],
  "Unknown": []
}

let signsAndKills = {};
let killersByCountry = {};
let killersByType = {}; // TODO

// external functions to load or parse data correctly
function formatAstrologyDates(){

  signs = Object.keys(astrologySignsData);

  signs.forEach(d => {

    formatedDates = [];
    let dates = astrologySignsData[d];

    dates.forEach(date => {
      changeDate = formatTime(date);
      formatedDates.push(changeDate);
    });

    astrologySignsData[d] = formatedDates;
  })
};

function loadSignsAndKills(signsAndSerialKillers)
{
  signsAndUnknown = Object.keys(signsAndSerialKillers);

  signsAndUnknown.forEach(sign => {
    let serialKillers = signsAndSerialKillers[sign];
    let totalConfirmedKillsPerSign = 0;
    let totalPossibleKillsPerSign = 0;

    serialKillers.forEach(killer =>{
      totalConfirmedKillsPerSign += killer['ProvenVictims'];
      totalPossibleKillsPerSign += killer['PossibleVictims'];
    })

    signsAndKills[sign] = {
      'numKillers' : signsAndSerialKillers[sign].length,
      'numProven': totalConfirmedKillsPerSign,
      'numPossible': totalPossibleKillsPerSign
    }
  });
}

var signTypeMap = new Map();
let prevSign = "";

function loadSignsAndKillerTypes(signsAndSerialKillers)
{
    signs = Object.keys(signsAndSerialKillers);

    signs.forEach(sign => {
      killers = signsAndSerialKillers[sign];
      var typeCountMap = new Map();

      killers.forEach(killer => {
        let killerType = killer.Type;

        killerType.forEach(type => {
          // quick & dirty data fix for blank
          // types
          if(type == "")
          {
            type = "N/A";
          }

          // map the types to a count
          if (typeCountMap.has(type)) {

            let typeCount = typeCountMap.get(type) + 1;
            typeCountMap.set(type, typeCount);

          } 
          else {
          typeCountMap.set(type, 1);
          }

          killersByType[sign] = typeCountMap;

        })

      })

    })

}

// Load data
Promise.all([
  d3.csv('data/collective-serial-killer-database.csv'),
  d3.json('data/countries.topo.json'),
  d3.csv('data/signs-info.csv')
]).then(files => {
  serialKillersData = files[0];
  worldCountryData = files[1];

  // format signs dates to correct format
  formatAstrologyDates();

  // set up array of countries in the world
  worldCountryData.objects.countries.geometries.forEach(d => {
    if (d.properties.name == "United States of America") {
      killersByCountry["United States"] = 0;
    } else {
      killersByCountry[d.properties.name] = 0;
    }
  });

  // assign each serial killer to their correct zodiac sign
  serialKillersData.forEach(d => {
    birthday = formatTime(new Date(d.Birthday));
    signs = Object.keys(astrologySignsData);

    killerTypesString = d.Type;
    d.Type = killerTypesString.split(", ");

    killerNicknameString = d.Nickname;
    d.Nickname = killerNicknameString.split(", ");

    d.ProvenVictims = +d.ProvenVictims;
    d.PossibleVictims = +d.PossibleVictims;

    //match serial killer with sign based on birthday
    //if birthday exists
    if(birthday != "NaN/NaN")
    {
      signs.forEach(sign => {
        formatedDates = [];
        let dates = astrologySignsData[sign];

        dates.forEach(date => {
          if(date == birthday){

            // push entire serial killer attribute to 
            // list based on astrological sign
            signsAndSerialKillers[sign].push(d);

          }
        });
      });
    } else {
      signsAndSerialKillers["Unknown"].push(d);
    }

    // populate countries by killers
    killerCountriesActiveString = d.CountriesActive;
    d.CountriesActive = killerCountriesActiveString.split(",");

    if (d.CountriesActive.length == 1) {
      killersByCountry[d.CountriesActive]++;
    } else {
      d.CountriesActive.forEach(d => {
        killersByCountry[d]++;
      });
    }

    killersByCountry["United States of America"] = killersByCountry["United States"];
  });

  // assign the total number of confirmed kills +
  // total number of possible kills to each zodiac sign
  // ie loads signsAndKills map
  loadSignsAndKills(signsAndSerialKillers);

  // returns obj where key is astrlogical sign, 
  // value is a map that maps the type and the amount of times the type
  // shows up
  // SEE: {[astrological sign]: Map(type: # of types, type # of types...)}
  // ie. {..., Gemini: {"Strangler" => 14, "NA" => 14...}, ...}
  loadSignsAndKillerTypes(signsAndSerialKillers);

  /*
  console.log(killersByCountry);
  console.log("signs");
  console.log(signsAndSerialKillers);
  console.log("elements");
  console.log(elements);
  console.log("signs elements dict");
  console.log(signsElementsDict);*/

  // load info on astrological signs
  files[2].forEach(d => {
    signsInfoDict[d.Sign] = {
      "type": d.Type,
      "modality": d.Modality,
      "dates": d.Dates,
      "description": d.Description
    };
  });

  // loading data for the choropleth map
  choroplethMap.world_geo = files[1];
  choroplethMap.killersByCountry = killersByCountry;
  choroplethMap.data = signsAndSerialKillers;
  choroplethMap.elements = elements;
  choroplethMap.update();

  // load and update barchart
  barChart.signsAndKills = signsAndKills;
  barChart.update();
  barChart.registerSelectCallback((sign) => {
    highlightedSign = sign;
    zodiacCycle.highlightNode(highlightedSign);

    updateSignInfo();
  });

  // load and update zodiacCycle nodes
  zodiacCycle.data = signsAndKills;
  zodiacCycle.elements = elements;
  zodiacCycle.signsInfoDict = signsInfoDict;

  zodiacCycle.update();
  zodiacCycle.registerSelectCallback((sign) => {
    highlightedSign = sign;
    barChart.highlightBar(highlightedSign);

    updateSignInfo();
  });

  updateSignInfo();
});

///////////////////////
// INTERACTIVE ELEMENTS

$("#view-toggle").on("click", function() {
  isCyclicView = $(this).text() == "Cyclic View";

  zodiacCycle.setPositions = true;
  zodiacCycle.isCyclicView = !isCyclicView;
  zodiacCycle.update();

  // Update button label
  $(this)[0].innerHTML = (isCyclicView ? "Element Group View" : "Cyclic View");
});

const killCountOptions = ["Number of Killers", "Proven Kills", "Proven + Possible Kills"];
const sortBarChartOptions = ["Sign Order", "Most to Least", "Least to Most"];

const killCountVariableNameDict = {};
killCountVariableNameDict[killCountOptions[0]] = "numKillers";
killCountVariableNameDict[killCountOptions[1]] = "numProven";
killCountVariableNameDict[killCountOptions[2]] = "numPossible";

// add the options to the button
d3.select("#kill-count-select")
  .selectAll('killCountOptions')
  .data(killCountOptions)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }); // corresponding value returned by the button

// selection to sort bar chart
d3.select("#sort-bars")
  .selectAll('sortBarChartOptions')
  .data(sortBarChartOptions)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }); // corresponding value returned by the button

zodiacCycle.countType = killCountVariableNameDict[d3.select("#kill-count-select").property("value")];
zodiacCycle.update();

d3.select("#kill-count-select").on("change", function(d) {
  // recover the option that has been chosen
  var selectedOption = d3.select(this).property("value")

  zodiacCycle.countType = killCountVariableNameDict[selectedOption];
  barChart.selectedCountOption = selectedOption;
  zodiacCycle.update();
  barChart.update();

});

d3.select("#sort-bars").on("change", function(d) {
  var selectedOption = d3.select(this).property("value")

  barChart.sortOption = selectedOption;
  barChart.update();
});

function updateSignInfo() {
  console.log("Highlighted Sign: " + highlightedSign);
  if (!highlightedSign) {return;} 

  $("#signNameText")[0].innerHTML = highlightedSign;
  $("#datesText")[0].innerHTML = signsInfoDict[highlightedSign].dates;
  $("#typeText")[0].innerHTML = signsInfoDict[highlightedSign].type.toUpperCase();
  $("#modalityText")[0].innerHTML = signsInfoDict[highlightedSign].modality.toUpperCase();
  $("#descriptionText")[0].innerHTML = signsInfoDict[highlightedSign].description;

  elements.forEach(e =>  $("#typeText").removeClass(e));
  $("#typeText").className = '';
  $("#typeText").addClass(signsInfoDict[highlightedSign].type);
}
