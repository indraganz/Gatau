const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();

const tebakHewan = async () => {
    const randomPageNumber = Math.floor(Math.random() * 5) + 1; // Assuming there are 5 pages
    const url = `https://rimbakita.com/daftar-nama-hewan-lengkap/${randomPageNumber}/`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract all animal data
        const animals = $('div.entry-content.entry-content-single img[class*=wp-image-][data-src]').map((_, element) => {
            const src = $(element).attr('data-src');
            const alt = path.basename(src, path.extname(src)).replace(/-/g, ' ');
            const capitalizedAlt = alt.charAt(0).toUpperCase() + alt.slice(1);
            return {
                jawaban: capitalizedAlt,
                url: src
            };
        }).get();

        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        return {
            creator: global.creator,
            ...randomAnimal
        };
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};

module.exports = { tebakHewan };
