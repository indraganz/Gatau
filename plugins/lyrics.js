const fetch = require('node-fetch');

const getLyrics = async (text) => {
    const url = `https://widipe.com/lirik?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
    }
    const data = await response.json();
    
    if (data.lyrics && data.lyrics.result) {
        data.lyrics.creator = global.creator || 'Furina - Indraa Code'; 
    }
    return data;
};

module.exports = { getLyrics };
