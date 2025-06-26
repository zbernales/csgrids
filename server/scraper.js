const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePlayerIdsAndNames() {
    try {
        const response = await axios.get('https://www.hltv.org/stats/players', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
            }
        });
        const $ = cheerio.load(response.data);

        // Your scraping logic goes here
        $('.playerCol a').each((index, element) => {
            const playerName = $(element).text().trim();
            const playerUrl = $(element).attr('href');
            const playerId = playerUrl.split('/')[2];
            console.log(`Player ID: ${playerId}, Player Name: ${playerName}`);
        });

    } catch (error) {
        console.error('Error scraping HLTV:', error);
    }
}

scrapePlayerIdsAndNames();