const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let globalUsageCount = 0; // Global counter for all API keys
const apiKeyLimit = 100; // Daily limit for all API keys

function checkLimit(apiKey) {
    return new Promise((resolve, reject) => {
        if (!apiKey) {
            return reject({ status: 400, msg: 'API key is required' });
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
module.exports = checkLimit
