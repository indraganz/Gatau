const axios = require('axios');
const qs = require('qs');

const startTime = Date.now();

const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours} Hour ${minutes % 60} Minute ${seconds % 60} Seconds`;
};

const getElapsedTime = () => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    return formatDuration(elapsedTime);
};

const runtime = async () => {
    try {
        return getElapsedTime(); // Return the formatted elapsed time
    } catch (error) {
        throw new Error(`Failed to calculate runtime: ${error.message}`);
    }
};

exports.runtime = runtime;
