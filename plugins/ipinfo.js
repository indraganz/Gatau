const axios = require('axios');

const getIpInfo = async (ip) => {
    try {
        const response = await axios.get(`https://ipwho.is/${ip}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch IP information: ${error.message}`);
    }
};

exports.getIpInfo = getIpInfo;
