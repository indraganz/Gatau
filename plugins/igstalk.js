const axios = require('axios');
const cheerio = require('cheerio');

const igstalk = async (username) => {
    try {
        const url = `https://dumpoir.com/v/${username}`;
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const profileData = {
            username: $('.profile-header__user-name').text().trim(),
            fullName: $('.profile-header__full-name').text().trim(),
            bio: $('.profile-header__bio').text().trim(),
            posts: $('.profile-stats__item--posts .profile-stats__number').text().trim(),
            followers: $('.profile-stats__item--followers .profile-stats__number').text().trim(),
            following: $('.profile-stats__item--following .profile-stats__number').text().trim(),
            profileImage: $('.profile-header__avatar img').attr('src'),
        };

        if (!profileData.username) {
            throw new Error('Could not find user profile');
        }

        return profileData;
    } catch (error) {
        throw new Error(`Failed to fetch Instagram profile: ${error.message}`);
    }
};

exports.igstalk = igstalk;
