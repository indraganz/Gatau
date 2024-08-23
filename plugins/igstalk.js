const puppeteer = require('puppeteer');

const igstalk = async (username) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://dumpoir.com/v/${username}`, { waitUntil: 'networkidle2' });

        const profileData = await page.evaluate(() => {
            return {
                username: document.querySelector('.profile-header__user-name')?.textContent.trim() || '',
                fullName: document.querySelector('.profile-header__full-name')?.textContent.trim() || '',
                bio: document.querySelector('.profile-header__bio')?.textContent.trim() || '',
                posts: document.querySelector('.profile-stats__item--posts .profile-stats__number')?.textContent.trim() || '',
                followers: document.querySelector('.profile-stats__item--followers .profile-stats__number')?.textContent.trim() || '',
                following: document.querySelector('.profile-stats__item--following .profile-stats__number')?.textContent.trim() || '',
                profileImage: document.querySelector('.profile-header__avatar img')?.src || ''
            };
        });

        await browser.close();

        if (!profileData.username) {
            throw new Error('Could not find user profile');
        }

        return profileData;
    } catch (error) {
        throw new Error(`Failed to fetch Instagram profile: ${error.message}`);
    }
};

exports.igstalk = igstalk;
