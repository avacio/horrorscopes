# project_babyyodavision: HORRORSCOPES
## Summary
This data visualization is purely for entertainment purposes and gives the viewer information about serial killers and their corresponding horoscope (astrological sign). These interactive views will allow users to explore and learn more about serial killers such as their sun signs, their kill magnitude breakdown, as well as their locations around the world. For believers and non-believers of astrology, this data visualization is a fun way for people to support or deny their pre-existing beliefs and stereotypes associated with each astrological sign.  
<br>
<img src="/thumbnail.png" width="400px"></img>


# MILESTONE 3
Please refer to `Milestone3Writeup.pdf` in the root directory.

# MILESTONE 2

## Design Rationale
### Rationale for our design choices
We have 3 planned views and 1 potential view if there is time at the end:
1. Node-link diagram of astrological signs (“signs network” view)
2. Stacked bar chart
3. World map of serial killers
4. (Potential) Pie chart - links to the map and shows serial killer types

Attributes/information we are encoding:
- Astrological zodiac signs
  - categorical
  - cardinality: 12
- Astrological sign element groups
  - fire, earth, air, water
  - categorical
  - cardinality: 4
- Number of killers (for each sign)
  - quantitative
  - integer: range[30, 51]
- Number of proven kills (for each sign)
  - quantitative
  - integer: range[228, 774]
- Number of proven and possible kills (for each sign)
  - quantitative
  - integer: range[657, 1998]
- Serial killer type
  - e.g., strangler, necrophiliac, rapist
  - categorical
  - cardinality: 7
  - a serial killer may have none, several, or all of the serial killer types

We currently have 2 UI elements:
- Count Type Dropdown Menu
  - Can show quantities in the view by:
    - number of killers (for each sign)
    - number of proven kills (for each sign)
    - number of proven and possible kills (for each sign)
  - This dropdown primarily affects the signs network and bar chart views and helps link them
- View toggle for Signs Network view
  - Toggles between a "cyclic view" and "element group view"

In our original design, we had planned on users being able to select astrological signs in the signs network view to compare side-by-side in a linked bar chart. After discussing both within the team and with Zipeng, we have decided to have all 12 of the signs shown at once in the bar chart. The cardinality of the astrological signs will always be fixed at 12, and so it is not too heavy of a cognitive load to display and compare between 12 at once. To remedy the use case of a user wanting to directly compare 2 signs together, we have decided to change the interaction instead so that users may be able to drag and reposition the bars themselves, so that they may be in any order that the user desires. We are planning on implementing this dragging-bar feature by the next milestone.

As for the signs network view, we had originally planned on making it a static view, only of the entire zodiac cycle. Since then, it has evolved into an actual network, with dynamic movement drag interaction through the use of d3’s force simulation. By using force simulation, users can compare nodes by moving them next to one another, and it also adds an element of fun and responsiveness.

Each node represents an astrological sign, along with the sign’s traditional symbol. Color encodes the sign’s attributed natural element (i.e. fire), and the node size encodes selected kill count type.

For the map visualization, our initial implementation was to show the locations of serial killers around the world by having marks/dots represent each serial killer that was active within a country. However, after implementing the world map, we realized the countries were too small to properly show all the information in a visually appealing way, especially considering the United States has over 200 killers. Instead, we changed the design so that when the page is first loaded, the number of killers that was active in a country is initially shown as a text label. Countries without any killers are represented by having a grey fill. Zooming and panning are implemented on the map so that once the user has zoomed in to a certain size such that the country is big enough on the screen, the text labels will get replaced with the individual dots that represent individual serial killers. From there, the user can hover over a dot to see basic information about a specific serial killer or select the dot to get specific notes. The implementation of serial killers as dots will be completed by the next milestone.

### How our vision has changed since the proposal

#### How our visualization goals changed
While our overall visualization goals have not changed, we have new data that we want to showcase. As such, we have new goals that we want to achieve within our visualization. 

Our primary goal from our proposal was to “allow users to explore and learn more about serial killers such as their sun signs, their kill magnitude breakdown, as well as their locations around the world.” With our new data set, which gives us more comprehensive serial killer “types” (Stalker, Strangler, etc), we wanted to include this in our goals. As such, our new goal includes allowing users to be able to learn about serial killer types and compare them based on astrological signs (ie number of stalkers who are Geminis vs. stalkers who are Aquarius).

#### Does our visualization enable the tasks we set out to facilitate or successfully communicate the story you want to tell
The following tasks we set out to facilitate in our proposal were:
- User can easily [compare] the number of serial killers associated with each sign.
- User can [sort] the signs (by most number of killers to least, or least to most)  to get a more accurate read 
- User can [select] an astrological sign on the “radial chart” to see which astrological signs actually have a certain number of kills (ie 15-20 kills)
- User [zooms] in on the world view (map)
- User [hovers] over a dot in the USA and sees basic information about a specific serial killer born in the US (birthday, years active, sun sign, victims & possible victims). 
- User [selects] the dot to get specific notes about the serial killer.

In our current visualization, the user can easily compare the number of serial killers associated with each sign. However, instead of seeing a specific number of kills, our visualization currently only facilitates the comparison of the total number of proven kills and the total number of proven and suspected kills. Our visualization facilitates this by providing a drop down menu, where the user can select between “Number of Killers”, “Proven Kills”, and “Proven + Possible Kills”. For our next milestone, we plan on implementing the stacked bar so that a user can compare and see what type of sign actually has a certain number of kills (ie 15-20 kills).

User no longer have to select an astrological sign on the "radial chart" to compare each sign. As mentioned previously, after discussion with the TA and with the team, all 12 signs will be visible on the bar chart. Instead, user may [compare] by interacting with the bar (dragging Aquarius next to Capricorn to compare). They could also [sort] from least to most kills/killers (to be implemented next milesone).

Our visualization will no longer facilitate “selecting” to enter the world view - rather, users can scroll down and see the world map. Users can now [compare] the number of killers from one country to another, as the number of killers per country is displayed. This will act as a basis for our next milestone, which will allow us to ensure that we are still facilitating our last two tasks listed above: hovering over the dot to get basic information about a killer, and selecting to get specific notes.

### Screenshots
<ul>
  <li><img src="/src/screenshots/m2-a.png" width="400px"</img></li>
   <li><img src="/src/screenshots/m2-b.png" width="400px"</img></li>
  <li><img src="/src/screenshots/m2-c.png" width="400px"</img></li>
</ul>

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
<br>

## Project Management & Team Assessment
### Status Update
**bolded elements** denote unplanned schedule changes

| Milestone | Tasks | Assignee(s) | Original Deadline / Hours Expected | Date Completed / Hours Completed |
| --- | --- | --- | --- | --- |
| 2 - Boilerplate | <ul><li>initialize repo with boilerplate code</li><li>adjust and restructure file structure</li></ul>  | Alexis | March 9 / 3 hours | March 8 / 2 hours |
| **2 - Data compilation** | **<ul><li>Integrate dataset from Wikipedia and The Serial Killer Database into one csv file</li><li>Manual data entry</li></ul>** | **Alexis, Grace, Margaret** | **N/A (Additional work required that was not included in the original milestone)** | **March 19 / 12 hours** |
| 2 - Data processing | <ul><li>Process data in Javascript to desired maps/arrays categories</li></ul> | Grace | March 16 / 3 hours | March 20 / 3 hours |
| 2 - Astrological Sign View | <ul><li>Begin work on this view</li><li>Incorporate dropdown & toggle UI</li></ul> | Alexis | March 18 / 13 hours | Initial Version: March 18 / 11 hours<br> **Refined Version: March 28 / 5 hours** |
| 2 - Stacked / Grouped Bar chart View | <ul><li>Begin work on this view</li></ul> | Grace | March 18 / 13 hours | Initial version: March 23 / 10 hours |
| 2 - World Map View | <ul><li>Begin work on this view</li><li>Interactive tooltips</li></ul> | Margaret | March 18 / 13 hours | Initial version: March 24 / 10 hours<br>**Still need to work on interactivity and being able to show each individual killer within a country** |
| **2 - Data Quality Control** | **<ul><li>Fix errors in csv file from manually entering data/combining data from 2 different sources</li><li>Typos, and reformatting for easier data use</li></ul>** | **Margaret** | **N/A** | **March 28 / 3 hours** |
| 2 - Link Views | <ul><li>Link views and integrate code</li></ul> | Margaret, **Grace, Alexis** | March 25 / 3 hours | March 28 / 3 hours -- **Class received extension for milestone 2!<br>Linked views will have to be refined in the next milestone**|
| 2 - Clean up | <ul><li>Clean up and document code</li><li>Organize file structures</li></ul> | Alexis, Margaret, Grace | March 25 / 5 hours | March 28 / 5 hours -- **Class received extension for milestone 2!** |
| 2 - Reflective Write-up | <ul><li>Write rationale of design choices</li><li>Document any changes</li><li>Status update of team and project management</li><li>Assess team process and contributions</li></ul> | Alexis, Margaret, Grace | March 25 / 5 hours | March 28 / 6 hours -- **Class received extension for milestone 2!** |
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
| <ul><li>The astrological nodes visualization (force simulation) with cyclic and element group view options</li><li>UI elements: dropdown for kill count, view button toggle</li><li>Data compilation and processing of astrological signs information</li><li>User interaction of showing astrological information on node hover</li><li>Manual data entry to improve our database of serial killers</ul> | <ul><li>Parsing + mangling the data so that each killer’s birthday is matched correctly to an astrological sign</li><li>Parsing + mangling data to match astrological sign to total number of proven kills and number of proven/suspected kills</li><li>Implemented a barchart which updates based on dropdown selection (# of killers, proven kill count, proven/suspected kill count)</li><li>Manual data entry to improve database of serial killers</li><li>Manual data fixes for suspected kill count (took the average of sliding scale counts, ie. 8-10 suspected kills were changed to 9 suspected kills)</ul> | <ul><li>The world map visualization</li><li>Parsed countries information from serial killers .csv and linked it to the data from world TopoJSON</li><li>Manual data entry, fixed errors, and reformatted info in the csv file</li><li>Moved and formatted content from Google docs into README</li></ul> |

### Team Process
|   | Weak | Satisfactory | Good | Excellent | What are specific actions you want to take to address issues|
| --- | --- | --- | --- | --- | --- |
| Team has a clear vision of the problem(s)  | | | | X | We were able to talk to Zipeng this week about our concerns regarding design and scope through TA office hours, and it was very helpful |
| Team is properly organized to complete task and cooperates well |   |   |  | X | Looks like we are on track to complete our visualizations! |
| Team managed time wisely |  |  | X |  | We could have a more efficient pipeline, but we are definitely working on it for next milestone.|
| Team acquired needed knowledge base  |  |  |  | X | From force simulation, to customized map hybrids, and data parsing, we learned what we needed to know |
| Efforts communicated well within group  |   |   |   | X| Through online group chats and periodic video calls |

