let dogHouse = new DogHouse({ parentElement: '#task2a' });

// Load data
Promise.all([
  d3.csv('data/Dogs-Database.csv'),
  d3.csv('data/Flights-Database.csv')
]).then(files => {
  let dogs = files[0];
  let flights = files[1];

  // format: {key: dog's english name, value: array of flight information}
  dogFlightDict = {};

  // Get all flight information for each dog...
  // While I did not end up using the dictionary,
  // it is definitely still useful, perhaps for extension
  // of this visualization?
  flights.forEach(d => {
    let dogSet = d.Dogs.split(",");
    dogSet.forEach(dn => {
      if (dogFlightDict[dn]) {
        dogFlightDict[dn].push(d);
      } else {
        dogFlightDict[dn] = [d];
      }
    });
  });

  dogHouse.data = dogs;
  dogHouse.update();
});


// INTERACTIVE ELEMENTS

$("#fate-toggle").on("click", function() {
  showFate = $(this).text() == "Show Fate";

  dogHouse.showFate = showFate;
  dogHouse.update();

  // Update button label
  $(this)[0].innerHTML = (showFate ? "Hide Fate" : "Show Fate");
});

var interval;
$("#float-toggle").on("click", function() {
  floatOn = $(this).text() == "Float On";

  // Update button label
  $(this)[0].innerHTML = (floatOn ? "Float Off" : "Float On");

  // Toggle float
  dogHouse.floatOn = !floatOn;

  if (!floatOn) {
    interval = setInterval(() => {
      dogHouse.floatOn = !dogHouse.floatOn
      dogHouse.update();
    }, 2000);
  } else {
    clearInterval(interval);
  }

  dogHouse.update();
});

// Float on start
$("#float-toggle").click();