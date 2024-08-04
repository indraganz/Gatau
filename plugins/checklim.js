
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let globalUsageCount = 0; // Global counter for all API keys
const apiKeyLimit = 100; // Daily limit for all API keys

function checkLimit(apiKey, options = {}) {
    return new Promise((resolve, reject) => {
        if (!apiKey) {
            return reject({ status: 400, msg: 'API key is required' });
        }

        if (apiKey === 'indrafarida') {
            // Jika API key adalah 'indrafarida', tidak mengurangi limit
            return resolve({
                limitReached: false,
                currentUsage: globalUsageCount,
                apiKeyLimit: -1
            });
        }

        // Cek jika hanya untuk memeriksa limit
        if (options.checkOnly) {
            return resolve({
                limitReached: globalUsageCount >= apiKeyLimit,
                currentUsage: globalUsageCount,
                apiKeyLimit
            });
        }

        // Check if the global usage count has reached the limit
        const limitReached = globalUsageCount >= apiKeyLimit;

        if (!limitReached) {
            globalUsageCount++; // Increment the global usage count
        }

        resolve({
            limitReached,
            currentUsage: globalUsageCount,
            apiKeyLimit
        });
    });
}

module.exports = checkLimit;
