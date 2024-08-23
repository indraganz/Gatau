const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchHappyMod = async (query) => {
    const url = `https://www.happymod.com/search.html?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch data from HappyMod');
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Contoh mengambil data, sesuaikan dengan struktur HTML aktual
    const results = [];
    $('.search-result-item').each((index, element) => {
        const title = $(element).find('.title').text().trim();
        const link = $(element).find('a').attr('href');
        results.push({ title, link });
    });

    return results;
};

module.exports = { searchHappyMod };
