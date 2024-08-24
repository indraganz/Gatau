const axios = require('axios');
const cheerio = require('cheerio');

const fetchLyrics = async (query) => {
    const searchUrl = `https://genius.com/search?q=${encodeURIComponent(query)}`;
    
    try {
        const searchResponse = await axios.get(searchUrl);
        const $ = cheerio.load(searchResponse.data);

        // Find the first search result
        const songUrl = $('a.song_link').attr('href');
        
        if (!songUrl) {
            return { creator: 'Genius', results: [], error: 'No song found' };
        }

        // Fetch the song page
        const songResponse = await axios.get(songUrl);
        const $$ = cheerio.load(songResponse.data);

        // Extract lyrics
        const lyrics = $$('div[data-lyrics-container="true"]').text().trim();

        return {
            creator: 'Genius',
            results: [{ url: songUrl, lyrics }]
        };
    } catch (error) {
        throw new Error(`Failed to fetch lyrics: ${error.message}`);
    }
};

module.exports = { fetchLyrics };
