
const axios = require('axios');
const cheerio = require('cheerio');

const downloadFromYouTube = async (url) => {
    try {
        const encodedUrl = encodeURIComponent(url);
        const response = await axios.get(`https://id.savefrom.net/1-yt-download`, {
            params: {
                url: encodedUrl
            }
        });

        const $ = cheerio.load(response.data);

        let downloadLinks = [];
        $('a[href^="/download/"]').each((index, element) => {
            let link = $(element).attr('href');
            let quality = $(element).text().trim();
            downloadLinks.push({
                quality,
                url: `https://id.savefrom.net${link}`
            });
        });

        return {
            creator: 'SaveFrom.net',
            results: downloadLinks
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { downloadFromYouTube };
