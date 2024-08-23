const fetch = require('node-fetch');

// Fungsi untuk mendapatkan lirik dari API
const getLyrics = async (text) => {
    const url = `https://widipe.com/lirik?text=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
    }
    const data = await response.json();
    return data;
};

module.exports = { getLyrics };
