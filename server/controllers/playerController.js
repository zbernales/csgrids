const { HLTV } = require('hltv')
const handlePlayerPost = (req, res) => {
    const { rowIndex, colIndex, playerName } = req.body;
    console.log(`Row index: ${rowIndex}, Column index: ${colIndex}, Player selected: ${playerName}`);
    HLTV.getPlayerByName({ name: playerName}).then(async (player) => {

        let array1 = ['Team', 'FaZe'];
        let array2 = ['Team', 'Luminosity'];
        let array3 = ['Country', 'Brazil'];
        const condition1 = await checkCondition(array1, player);
        const condition2 = await checkCondition(array2, player);
        const condition3 = await checkCondition(array3, player);
        if (condition3) {
          console.log('Valid');
        } else {
          console.log('Invalid');
        }
      });
    res.status(200).json({ message: 'Player data received successfully', data: { rowIndex, colIndex, playerName} });
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
      return false;
    }
    case 'Rating': {
      return false;
    }
    case 'RatingByEventType': {
      return false;
    }
    case 'RatingByEventPrizepool': {
      return false;
    }
    default:
      console.error(`Unknown statistic type: ${type}`);
      return false;
  }
}

module.exports = { handlePlayerPost };