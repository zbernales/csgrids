const { HLTV } = require('hltv')
const handlePlayerPost = (req, res) => {
  const { rowIndex, colIndex, playerName } = req.body;
  console.log(`Row index: ${rowIndex}, Column index: ${colIndex}, Player selected: ${playerName}`);
  HLTV.getPlayerByName({ name: playerName}).then(async (player) => {
      let array1 = ['Team', 'FaZe'];
      let array2 = ['Team', 'Luminosity'];
      let array3 = ['Country', 'Brazil'];
      let array4 = ['Continent', 'Europe'];
      const condition1 = await checkCondition(array1, player);
      const condition2 = await checkCondition(array2, player);
      const condition3 = await checkCondition(array3, player);
      const condition4 = await checkCondition(array4, player);
      if (condition4) {
        console.log('Valid');
      } else {
        console.log('Invalid');
      }
    });
  res.status(200).json({ message: 'Player data received successfully', data: { rowIndex, colIndex, playerName} }); // inputting steel results in crash
};

async function checkCondition(statistic, player) {
  let type = statistic[0];
  switch (type) {
    case 'Team': {
      let teamName = statistic[1];
      return player.teams.some((team) => team.name === teamName); 
    }
    case 'Country': {
      let countryName = statistic[1];
      return player.country.name == countryName;
    }
    case 'Continent': {
      const continents = {
        Europe : new Set([
          "France", "Italy", "Germany", "Spain", "Portugal", "United Kingdom",
          "Ireland", "Belgium", "Netherlands", "Luxembourg", "Switzerland", "Austria",
          "Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria",
          "Greece", "Croatia", "Slovenia", "Serbia", "Bosnia and Herzegovina",
          "Montenegro", "North Macedonia", "Albania", "Norway", "Sweden",
          "Finland", "Denmark", "Iceland", "Estonia", "Latvia", "Lithuania",
          "Ukraine", "Belarus", "Moldova", "Russia", "San Marino", "Monaco",
          "Liechtenstein", "Andorra", "Malta", "Vatican City"
        ]),
        Asia : new Set([
          "China", "India", "Japan", "South Korea", "North Korea", "Vietnam",
          "Thailand", "Malaysia", "Singapore", "Indonesia", "Philippines",
          "Myanmar", "Cambodia", "Laos", "Bangladesh", "Pakistan", "Nepal",
          "Sri Lanka", "Maldives", "Bhutan", "Kazakhstan", "Uzbekistan",
          "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Afghanistan", "Iran",
          "Iraq", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait",
          "Bahrain", "Oman", "Yemen", "Israel", "Jordan", "Lebanon", "Syria",
          "Turkey", "Georgia", "Armenia", "Azerbaijan", "Mongolia"
        ]),
        NorthAmerica : new Set([
          "Canada", "United States", "Mexico", "Guatemala", "Belize", "Honduras",
          "El Salvador", "Nicaragua", "Costa Rica", "Panama", "Bahamas", "Cuba",
          "Jamaica", "Haiti", "Dominican Republic", "Barbados", "Trinidad and Tobago",
          "Saint Lucia", "Saint Vincent and the Grenadines", "Grenada",
          "Saint Kitts and Nevis", "Antigua and Barbuda", "Dominica"
        ]),
        SouthAmerica : new Set([
          "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Venezuela",
          "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Guyana", "Suriname"
        ]),
        Africa : new Set([
          "Nigeria", "Egypt", "South Africa", "Kenya", "Ethiopia", "Ghana",
          "Uganda", "Tanzania", "Sudan", "Algeria", "Morocco", "Tunisia",
          "Libya", "Senegal", "Mali", "Niger", "Chad", "Angola", "Namibia",
          "Botswana", "Zimbabwe", "Zambia", "Mozambique", "Madagascar",
          "Cameroon", "Ivory Coast", "Burkina Faso", "Rwanda", "Burundi",
          "Malawi", "Lesotho", "Eswatini", "Mauritania", "Sierra Leone",
          "Liberia", "Gabon", "Republic of the Congo", "Democratic Republic of the Congo",
          "Central African Republic", "Equatorial Guinea", "Guinea", "Guinea-Bissau",
          "Togo", "Benin", "Sao Tome and Principe", "Seychelles", "Comoros",
          "Cape Verde", "Djibouti", "Eritrea", "Somalia", "South Sudan", "Gambia"
        ]),
        Oceania : new Set([
          "Australia", "New Zealand", "Fiji", "Papua New Guinea", "Samoa",
          "Tonga", "Vanuatu", "Solomon Islands", "Kiribati", "Marshall Islands",
          "Micronesia", "Palau", "Nauru", "Tuvalu"
        ])
      };
      let continent = statistic[1];
      return continents[continent].has(player.country.name);
    }
    case 'Rating': {
      let rating = statistic[1];
      if (statistic[2] > 0) {
        return player.statistics.rating >= rating;
      } else {
        return player.statistics.rating <= rating;
      }
    }
    case 'RatingByEventType': {
      return false;
    }
    case 'RatingByEventPrizepool': {
      return false;
    }
    case 'KillsPerRound': {
      let kpr = statistic[1];
      if (statistic[2] > 0) {
        return player.statistics.killsPerRound >= kpr;
      } else {
        return player.statistics.killsPerRound <= kpr;
      }
    }
    case 'DeathsPerRound': {
      let dpr = statistic[1];
      if (statistic[2] > 0) {
        return player.statistics.deathsPerRound >= dpr;
      } else {
        return player.statistics.deathsPerRound <= dpr;
      }
    }
    case 'MapsPlayed': {
      let mapsPlayed = statistic[1];
      if (statistic[2] > 0) {
        return player.statistics.mapsPlayed >= mapsPlayed;
      } else {
        return player.statistics.mapsPlayed <= mapsPlayed;
      }
    }
    case 'Headshots': {
      let headshots = statistic[1];
      if (statistic[2]> 0) {
        return player.statistics.headshots >= headshots;
      } else {
        return player.statistics.headshots <= headshots;
      }
    }
    default:
      console.error(`Unknown statistic type: ${type}`);
      return false;
  }
}

module.exports = { handlePlayerPost };