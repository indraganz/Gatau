const axios = require('axios');
const qs = require('qs');

// Set startTime to 30 days ago
const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const startTime = Date.now() - thirtyDaysInMilliseconds;

const formatDuration = (milliseconds) => {
    const secondsInMinute = 60;
    const minutesInHour = 60;
    const hoursInDay = 24;
    const daysInMonth = 30; // Approximation for simplicity

    const totalSeconds = Math.floor(milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / secondsInMinute);
    const totalHours = Math.floor(totalMinutes / minutesInHour);
    const totalDays = Math.floor(totalHours / hoursInDay);
    const totalMonths = Math.floor(totalDays / daysInMonth);

    const seconds = totalSeconds % secondsInMinute;
    const minutes = totalMinutes % minutesInHour;
    const hours = totalHours % hoursInDay;
    const days = totalDays % daysInMonth;
    const months = totalMonths;

    return `${months} Month ${days} Day ${hours} Hour ${minutes} Minute ${seconds} Second`;
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
