const { HLTV } = require('hltv');
const { getSelectedDate } = require('../states/dateStore');
const fs = require('fs');
const grids = JSON.parse(fs.readFileSync("resources/grids.json", "utf8"));
const handlePlayerPost = (req, res) => {
  const { rowIndex, colIndex, playerName } = req.body;
  const selectedDate = getSelectedDate();
  let grid = grids.find(item => item.Date === selectedDate) || grids[0];
  let rows = grid.Rows;
  let cols = grid.Cols;
  console.log(`Row index: ${rowIndex}, Column index: ${colIndex}, Player selected: ${playerName}`);
  HLTV.getPlayerByName({ name: playerName}).then(async (player) => {
    if (!player || !player.id) {
      throw new Error(`Player not found: ${playerName}`)
    }
    //const stats = await HLTV.getPlayerStats({ id: player.id });
    //const condition1 = await checkCondition(rows[rowIndex], player, stats);
    //const condition2 = await checkCondition(cols[colIndex], player, stats);*/
    const condition1 = await checkCondition(rows[rowIndex], player);
    const condition2 = await checkCondition(cols[colIndex], player);
    if (condition1 && condition2) {
      console.log('Valid');
      res.status(200).json({ 
        message: 'Player data received successfully', 
        data: { 
          rowIndex, 
          colIndex, 
          playerName: player.ign,
          image: player.image
        } 
      }); // inputting steel, disco doplan, Guardian, kioshima results in crash
    } else {
      console.log('Invalid');
    }
  })
  .catch((error) => {
    console.error("Error fetching player:", error);
    res.status(500).json({ error: "Failed to fetch player data" });
  })
};

async function checkCondition(statistic, player) {
  let type = statistic[0];
  switch (type) {
    case 'Team': {
      let teamName = statistic[1];
      return player.teams.some((team) => team.name.toLowerCase() === teamName); 
    }
    case 'Country': {
      let countryName = statistic[1];
      return player.country.name == countryName;
    }
    case 'Continent': {
      const continents = {
        Europe : new Set([
          "France", "Italy", "Germany", "Spain", "Portugal", "United Kingdom",
          "Ireland", "Belgium", "Netherlands", "Luxembourg", "Switzerland", "Turkey","Austria",
          "Poland", "Czech Republic", "Slovakia", "Hungary", "Kosovo", "Romania", "Bulgaria",
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
      let continent = statistic[1].replaceAll(" ", "");
      return continents[continent].has(player.country.name);
    }
    case 'Rating': {
      let rating = statistic[1];
      if (statistic[2] > 0) {
        return player.statistics?.rating >= rating;
      } else {
        return player.statistics?.rating <= rating;
      }
    }
    case 'Major': {
      let majors = statistic[1];
      const otherMajors = new Set(['MLG Columbus 2016','DreamHack Open Cluj-Napoca 2015','ESL One Cologne 2015','ESL One Katowice 2015','DreamHack Winter 2014','ESL One Cologne 2014','EMS One Katowice 2014','Dreamhack Winter 2013']);
      if (statistic[2] > 0) {
        return player.achievements.filter(item => (item.event.name.includes('Major') || otherMajors.has(item.event.name)) && item.place === '1st').length >= majors;
      } else if (statistic[2] < 0) {
        return player.achievements.filter(item => (item.event.name.includes('Major') || otherMajors.has(item.event.name)) && item.place === '1st').length < majors;
      } else {
        return player.achievements.filter(item => (item.event.name.includes('Major') || otherMajors.has(item.event.name)) && item.place === '1st').length == majors;
      }
    }
    case 'TeamsPlayedFor': {
      let teamsPlayedFor = statistic[1];
      const uniqueTeams = new Set(player.teams.map(team => team.id)); 
      const teamCount = uniqueTeams.size;
      if (statistic[2] > 0) {
        return teamCount >= teamsPlayedFor;
      } else if (statistc[2] < 0) {
        return teamCount < teamsPlayedFor;
      } else {
        return teamCount == teamsPlayedFor;
      }
    }
    case 'Age': {
      let age = statistic[1];
      if (statistic[2] > 0) {
        return player.age >= age;
      } else {
        return player.age <= age;
      }
    }
    case 'RatingByEventType': {
      return false;
    }
    case 'RatingByEventPrizepool': {
      return false;
    }
    /*case 'KillsPerRound': {
      let kpr = statistic[1];
      if (statistic[2] > 0) {
        return stats.overviewStatistics.killsPerRound >= kpr;
      } else {
        return stats.overviewStatistics.killsPerRound <= kpr;
      }
    }
    case 'DeathsPerRound': {
      let dpr = statistic[1];
      if (statistic[2] > 0) {
        return stats.overviewStatistics.deathsPerRound >= dpr;
      } else {
        return stats.overviewStatistics.deathsPerRound <= dpr;
      }
    }
    case 'MapsPlayed': {
      let mapsPlayed = statistic[1];
      if (statistic[2] > 0) {
        return stats.overviewStatistics.mapsPlayed >= mapsPlayed;
      } else {
        return stats.overviewStatistics.mapsPlayed <= mapsPlayed;
      }
    }
    case 'Headshots': {
      let headshots = statistic[1];
      if (statistic[2] > 0) {
        return stats.overviewStatistics.headshots >= headshots;
      } else {
        return stats.overviewStatistics.headshots <= headshots;
      }
    }
    case 'KdRatio': {
      let kd = statistic[1];
      if (statistic[2] > 0) {
        return stats.overviewStatistics.kdRatio >= kd;
      } else {
        return stats.overviewStatistics.kdRatio <= kd;
      }
    }
    case 'Aces': {
      let aces = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.fiveKillRounds >= aces;
      } else {
        return stats.individualStatistics.fiveKillRounds <= aces;
      }
    }
    case 'Multikills': {
      let mk = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.roundsWithKills - stats.individualStatistics.oneKillRounds >= mk;
      } else {
        return stats.individualStatistics.roundsWithKills - stats.individualStatistics.oneKillRounds <= mk;
      }
    }
    case 'ZeroKillRounds': {
      let zk = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.zeroKillRounds >= zk;
      } else {
        return stats.individualStatistics.zeroKillRounds <= zk;
      }
    }
    case 'OpeningKills': {
      let ok = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.openingKills >= ok;
      } else {
        return stats.individualStatistics.openingKills <= ok;
      }
    }
    case 'OpeningKillRatio': {
      let okr = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.openingKillRatio >= okr;
      } else {
        return stats.individualStatistics.openingKillRatio <= okr;
      }
    }
    case 'RifleKills': {
      let rk = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.rifleKills >= rk;
      } else {
        return stats.individualStatistics.rifleKills <= rk;
      }
    }
    case 'SniperKills': {
      let sk = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.sniperKills >= sk;
      } else {
        return stats.individualStatistics.sniperKills <= sk;
      }
    }
    case 'PistolKills': {
      let pk = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.pistolKills >= pk;
      } else {
        return stats.individualStatistics.pistolKills <= pk;
      }
    }
    case 'GrenadeKills': {
      let gk = statistic[1];
      if (statistic[2] > 0) {
        return stats.individualStatistics.grenadeKills >= gk;
      } else {
        return stats.individualStatistics.grenadeKills <= gk;
      }
    }*/
    default:
      console.error(`Unknown statistic type: ${type}`);
      return false;
  }
}

module.exports = { handlePlayerPost };