# project_babyyodavision

## Design Rationale
### Rationale for our design choices

### How our vision has changed since the proposal

### Screenshots

### Links to the original data source
Our database was created by manually incorporating 2 sources together: 
<ul>
  <li><a href="https://en.wikipedia.org/wiki/List_of_serial_killers_by_number_of_victims">List of serial killers by numbers of victims from Wikipedia</a></li>
  <li><a href="https://killer.cloud/">The Serial Killer Database by Killer.Cloud</a></li>
</ul>

As for our information regarding the astrological signs themselves, we created our own .csv file while referencing sources such as:
<ul>
  <li><a href="https://www.astrology-zodiac-signs.com/">Zodiac signs and astrology signs meanings and characteristics</a></li>
  <li><a href="https://cafeastrology.com/natal/elements-astrology.html">The elements in astrology</a></li>
  <li><a href="https://blog.prepscholar.com/zodiac-symbols-signs">What's your zodiac sign? The 12 zodiac symbols</a></li>
  <li><a href="https://www.liveabout.com/astrological-symbols-4122678">Astrological symbols</a></li>
</ul>

### Data preprocessing pipeline
Our first iteration of our dataset used [data from Wikipedia](https://en.wikipedia.org/wiki/List_of_serial_killers_by_number_of_victims). We converted the wikitables to .csv files using [this tool](https://wikitable2csv.ggor.de/). Through this process we obtained 322 items of data, 211 of which had birthdays listed (we need birthdays in order to obtain their astrological signs)

Since the last milestone, however, we found additional information in [“The Serial Killer Database” by Killer.Cloud](https://killer.cloud/). Now we have increased our data pool to 512 serial killers with known birthdays.

Unfortunately, the database from KillerCloud did not have prepared .csv or .json files for sharing, so we proceeded to add the new serial killer information through manual data entry. This was a very long, arduous and tedious process, but we are hoping that adding all of this data will help us discover more meaning from our visualization. Due to manually integrating serial killer information from 2 different sources into one dataset, we encountered 71 errors with the dataset such as spelling mistakes and missing commas/quotations. We had to go find and fix the errors in the csv as it was causing data to be parsed incorrectly. Additionally, since we also needed to link the serial killer csv file with the world TopoJson data, countries that no longer exist today were replaced with the current country equivalent. For example killers from the Czech Republic were changed to be from Czechia instead so that it matches the country name from the world data.

Within our directory, the source files are:
<ul>
  <li>data/collective-serial-killer-database.csv
    <ul><li>Contains combined list of our Wikipedia and KilledCloud sources</li></ul>
  </li>
  <li>data/signs-info.csv
    <ul><li>Information about the signs (modality, description, element, dates, etc.)</li></ul>
  </li>
  <li>data/countries.topo.json
    <ul>
      <li><a href="https://www.npmjs.com/package/world-atlas">World TopoJSON</a></li>
      <li>Used for the map view</li>
    </ul>
  </li>
</ul>


## Project Management & Team Assessment
### Status Update
**bolded elements** denote unplanned schedule changes

| Milestone | Tasks | Assignee(s) | Original Deadline / Hours Expected | Date Completed / Hours Completed |
| --- | --- | --- | --- | --- |
| 2 - Boilerplate | <ul><li>initialize repo with boilerplate code</li><li>adjust and restructure file structure</li></ul>  | Alexis | March 9 / 3 hours | March 8 / 2 hours |
| **2 - Data compilation** | **<ul><li>Integrate dataset from Wikipedia and The Serial Killer Database into one csv file</li><li>Manual data entry</li></ul>** | **Alexis, Grace, Margaret** | **N/A (Additional work required that was not included in the original milestone)** | **March 19 / 12 hours** |
| 2 - Data processing | <ul><li>Process data in Javascript to desired maps/arrays categories</li></ul> | Grace | March 16 / 3 hours | --- |
| 2 - Astrological Sign View | <ul><li>Begin work on this view</li><li>Incorporate dropdown & toggle UI</li></ul> | Alexis | March 18 / 13 hours | Initial Version: March 18 / 13 hours<br> **Refined Version: March 28 / 10 hours** |
| 2 - Stacked / Grouped Bar chart View | <ul><li>Begin work on this view</li></ul> | Grace | March 18 / 13 hours | --- |
| 2 - World Map View | <ul><li>Begin work on this view</li><li>Interactive tooltips</li></ul> | Margaret | March 18 / 13 hours | --- |
| **2 - Data Quality Control** | **<ul><li>Fix errors in csv file from manually entering data/combining data from 2 different sources</li><li>Typos, and reformatting for easier data use</li></ul>** | **Margaret** | **N/A** | **March 28 / 2 hours** |
| 2 - Link Views | <ul><li>Link views and integrate code</li></ul> | Margaret, **Grace, Alexis** | March 25 / 3 hours | March 28 / 3 hours -- **Class received extension for milestone 2!<br>Linked views will have to be refined in the next milestone**|
| 2 - Clean up | <ul><li>Clean up and document code</li><li>Organize file structures</li></ul> | Alexis, Margaret, Grace | March 25 / 5 hours | March 28 / 5 hours -- **Class received extension for milestone 2!** |
| 2 - Reflective Write-up | <ul><li>Write rationale of design choices</li><li>Document any changes</li><li>Status update of team and project management</li><li>Assess team process and contributions</li></ul> | Alexis, Margaret, Grace | March 25 / 5 hours | March 28 / x hours -- **Class received extension for milestone 2!** |
| 3 - Visualization Review | <ul><li>Discuss things we like and don’t like</li><li>Determine direction moving forward and any changes that need to be made</li></ul> | Alexis, Margaret, Grace | March 27 / 3 hours | March 23 / 1 hour<br>March 27 / 1 hour<br>March 28 / 1 hour<br>**Review meetings happen iteratively** |
| 3 - UX/UI Discussion | <ul><li>Address any possible UX/UI improvements we could make?</li><li>Extract the feasible features</li></ul> | Alexis, Margaret, Grace | March 27 / 2 hours | March 27 / 2 hours |
| **3 - Iterative Review and Discussion** | **<ul><li>Present and review progress status</li><li>Discuss things we like and don’t like</li><li>How can we move forward?</li></ul>** | **Alexis, Margaret, Grace** | **April 6 / 4 hours** | --- |
| 3 - Finalize All Views | <ul><li>Make discussed changes from review</li><li>Refine existing features</li></ul> | Alexis, Margaret, Grace | April 6 / 30 hours | --- |
| 3 - Icebox | <ul><li>Any last-minute pretty things we would like to have, but are not necessary? Code!</li><li>Likely animations or interaction improvements</li></ul> | Alexis, Margaret, Grace | April 8 / 8 hours | --- |
| 3 - Final Review of Code | <ul><li>Triple-check all code and documentation</li><li>Triple-check implementation requirements</li></ul> | Alexis, Margaret, Grace | April 8 / 3 hours | --- |
| 3 - Write-up | <ul><li>Overview, goals and tasks</li><li>Reflection</li><li>Team assessment</li></ul> | Alexis, Margaret, Grace | April 10 / 6 hours | --- |
| 3 - Demo Practice | <ul><li>Prepare for our demo</li><li>Do we want PowerPoint slides as well?</li><li>Rehearse who is saying what and what we want to show</li></ul> | Alexis, Margaret, Grace | April 10 / 3 hours | --- |

### Contributions Breakdown
| Alexis | Grace | Margaret |
| --- | --- | --- |
| <ul><li>The astrological nodes visualization (force simulation) with cyclic and element group view options</li><li>UI elements: dropdown for kill count, view button toggle</li><li>Data compilation and processing of astrological signs information</li><li>User interaction of showing astrological information on node hover</li><li>Manual data entry to improve our database of serial killers</ul> | <ul><li>item</li><li>item</li><li>item</li><li>item</li><li>item</ul> | <ul><li>The world map visualization</li><li>Parsed countries information from serial killers .csv and linked it to the data from world TopoJSON</li><li>Manual data entry and fixed errors in the csv file</li><li>Moved and formatted content from Google docs into README</li> |

### Team Process
|   | Weak | Satisfactory | Good | Excellent | What are specific actions you want to take to address issues|
| --- | --- | --- | --- | --- | --- |
| Team has a clear vision of the problem(s)  | | | | X | We were able to talk to Zipeng this week about our concerns regarding design and scope through TA office hours, and it was very helpful |
| Team is properly organized to complete task and cooperates well |   |   |  | X | Looks like we are on track to complete our visualizations! |
| Team managed time wisely |  |  | X |  | We could have a more efficient pipeline, but we are definitely working on it for next milestone.|
| Team acquired needed knowledge base  |  |  |  | X | From force simulation, to customized map hybrids, and data parsing, we learned what we needed to know |
| Efforts communicated well within group  |   |   |   | X| Through online group chats and periodic video calls |

