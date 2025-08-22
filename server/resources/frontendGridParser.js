const { HLTV } = require('hltv');

async function convert(statArray) {
  const clientArray = new Array(6);
  const combinedArray = statArray.Cols.concat(statArray.Rows);

  for (let i = 0; i < combinedArray.length; i++) {
    const stat = combinedArray[i];
    const type = stat[0];

    switch (type) {
      case 'Team': {
        const team = await HLTV.getTeamByName({ name: stat[1] });
        const teamLogo = team.logo;
        clientArray[i] = teamLogo;
        break;
      }
      case 'Country':
      case 'Continent': {
        clientArray[i] = 'From ' + stat[1];
        break;
      }
      case 'Rating': {
        if (stat[2] > 0) {
          clientArray[i] = stat[1] + '+ HLTV rating';
        } else {
          clientArray[i] = 'Below ' + stat[1] + ' HLTV rating';
        }
        break;
      }
      case 'Major': {
        if (stat[2] > 0) {
          clientArray[i] = 'Won ' + stat[1] + '+ Majors';
        } else if (stat[2] < 0) {
          clientArray[i] = 'Has Won Fewer Than ' + stat[1] + ' Majors';
        } else {
          clientArray[i] = 'Has Won ' + stat[1] + ' Majors';
        }
        break;
      }
      case 'TeamsPlayedFor': {
        if (stat[2] > 0) {
          clientArray[i] = 'Has Played For ' + stat[1] + '+ Teams';
        } else if (stat[2] < 0) {
          clientArray[i] = 'Has Played For Fewer Than ' + stat[1] + ' Teams';
        } else {
          clientArray[i] = 'Has Played For Exactly ' + stat[1] + ' Teams';
        }
        break;
      }
      default: {
        console.error('Unknown statistic type');
      }
    }
  }
  return clientArray;
}

module.exports = convert;