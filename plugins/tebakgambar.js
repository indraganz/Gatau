const axios = require('axios');
const cheerio = require('cheerio');

const tebakGambar = async () => {
    const url = 'https://jawabantebakgambar.net/';

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract the image and answer
        const images = $('div.su-accordion img').map((_, element) => {
            const src = $(element).attr('src');
            const alt = $(element).attr('alt');
            return {
                creator: global.creator,
                jawaban: alt,
                url: src
            };
        }).get();

        // Randomly select one image-answer pair
        const randomImage = images[Math.floor(Math.random() * images.length)];

        return randomImage;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};

module.exports = { tebakGambar };
