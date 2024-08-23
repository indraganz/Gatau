const fetch = require('node-fetch');

const getLyrics = async (text) => {
    const url = `https://widipe.com/lirik?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
    }
    const data = await response.json();
    
    // Menghapus field creator dari response
    if (data.lyrics.result) {
        delete data.lyrics.creator; 
    }

    return data;
};

module.exports = { getLyrics };
