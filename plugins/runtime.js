const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours} Hour ${minutes % 60} Minute ${seconds % 60} Seconds`;
};

const getElapsedTime = (startTime) => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    return formatDuration(elapsedTime);
};

module.exports = { getElapsedTime };
