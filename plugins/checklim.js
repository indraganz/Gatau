const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Dummy data to simulate usage limits
let apiKeyLimits = {
    'furinafree': { usage: 0, limit: 1000 }, // Contoh penggunaan untuk API key 'furinafree'
    'indrafarida': { usage: 0, limit: -1 } // Tidak terbatas untuk 'indrafarida'
};

function checkLimit(apiKey) {
    return new Promise((resolve, reject) => {
        if (!apiKey) {
            return reject({ status: 400, msg: 'API key is required' });
        }

        const keyData = apiKeyLimits[apiKey];

        if (!keyData) {
            return reject({ status: 400, msg: 'Invalid API key' });
        }

        // Periksa penggunaan tanpa menambahnya
        const limitReached = keyData.usage >= keyData.limit;

        resolve({
            limitReached,
            currentUsage: keyData.usage,
            apiKeyLimit: keyData.limit
        });
    });
}

// Fungsi untuk menambah penggunaan
function addUsage(apiKey, amount) {
    return new Promise((resolve, reject) => {
        const keyData = apiKeyLimits[apiKey];

        if (!keyData) {
            return reject({ status: 400, msg: 'Invalid API key' });
        }

        keyData.usage += amount; // Tambah penggunaan
        resolve({
            currentUsage: keyData.usage,
            apiKeyLimit: keyData.limit
        });
    });
}

module.exports = {
    checkLimit,
    addUsage
};
