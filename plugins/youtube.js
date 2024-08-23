// plugin.js
const axios = require('axios');
const cheerio = require('cheerio');

const downloadFromYouTube = async (url, format) => {
    try {
        const encodedUrl = encodeURIComponent(url);
        const response = await axios.get(`https://id.savefrom.net/1-yt-download`, {
            params: {
                url: encodedUrl
            }
        });

        const $ = cheerio.load(response.data);

        let downloadLinks = [];
        let thumbnail = $('meta[property="og:image"]').attr('content'); // Thumbnail

        $('a[href^="/download/"]').each((index, element) => {
            let link = $(element).attr('href');
            let quality = $(element).text().trim();
            let downloadUrl = `https://id.savefrom.net${link}`;
            
            if (format === 'mp3' && quality.includes('MP3')) {
                downloadLinks.push({
                    quality,
                    url: downloadUrl
                });
            } else if (format === 'mp4' && quality.includes('MP4')) {
                downloadLinks.push({
                    quality,
                    url: downloadUrl
                });
            } else if (format === 'thumbnail') {
                downloadLinks.push({
                    quality: 'Thumbnail',
                    url: thumbnail
                });
            }
        });

        return {
            creator: 'SaveFrom.net',
            results: downloadLinks
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { downloadFromYouTube };
