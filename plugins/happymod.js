const axios = require('axios');
const cheerio = require('cheerio');

const happymod = async (query) => {
    try {
        const response = await axios.get(`https://www.happymod.com/search.html?q=${encodeURIComponent(query)}`);
        const $ = cheerio.load(response.data);
        let results = [];
        
        $('div.pdt-app-box').each((index, element) => {
            let name = $(element).find('a').text().trim();
            let icon = $(element).find('img.lazy').attr('data-original');
            let link = $(element).find('a').attr('href');
            let fullLink = `https://www.happymod.com${link}`;

            results.push({
                icon,
                name,
                link: fullLink
            });
        });

        return {
            creator: global.creator;
            results
    }
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};

module.exports = { happymod };
