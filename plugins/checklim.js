const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let globalUsageCount = 0; // Global counter for all API keys
const apiKeyLimit = 100; // Daily limit for all API keys

// checklim.js
function checkLimit(apiKey, options = {}) {
    return new Promise((resolve, reject) => {
        if (!apiKey) {
            return reject({ status: 400, msg: 'API key is required' });
        }

        // Special case for 'indrafarida'
        if (apiKey === 'indrafarida') {
            return resolve({
                limitReached: false,
                currentUsage: globalUsageCount,
                apiKeyLimit: -1
            });
        }

        // Check if it's only for limit checking
        if (options.checkOnly) {
            return resolve({
                limitReached: globalUsageCount >= apiKeyLimit,
                currentUsage: globalUsageCount,
                apiKeyLimit
            });
        }

        // Cek API key lainnya
        if (apiKey !== 'indrafarida') {
            const limitReached = globalUsageCount >= apiKeyLimit;

            if (!limitReached) {
                globalUsageCount++; // Increment global usage only for non-indrafarida keys
            }

            resolve({
                limitReached,
                currentUsage: globalUsageCount,
                apiKeyLimit
            });
        }
    });
}

module.exports = checkLimit;
