const axios = require('axios');
const cheerio = require('cheerio');

exports.nhentai = async (qq) => {
return new Promise(async (resolve, reject) => {
const url = `https://nhentai.net/search/?q=${encodeURIComponent(qq)}`;

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const galleries = [];

    $('.gallery').each((i, element) => {
      const title = $(element).find('.caption').text();
      const nhURL = 'https://nhentai.net' + $(element).find('a').attr('href');
      const imgSrc = $(element).find('img').data('src');

      galleries.push({ title, nhURL, imgSrc });
    });

    console.log(galleries);
    resolve(galleries)
  })
  .catch(error => {
    console.error('Error fetching page:', error);
  });
  
  })
  }
  
  
//url input example https://nhentai.net/g/497270/ 
exports.nhentaidl = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const gallery_id = $('#gallery_id').text().trim();
    const title = $('.title .pretty').text().trim();
    const parodies = $('.tag-container:contains("Parodies") .tags a .name').text().trim();
    const tags = $('.tag-container:contains("Tags") .tags a .name').map((index, element) => $(element).text().trim()).get();
    const group = $('.tag-container:contains("Groups") .tags a .name').text().trim();
    const languages = $('.tag-container:contains("Languages") .tags a .name').map((index, element) => $(element).text().trim()).get();
    const categories = $('.tag-container:contains("Categories") .tags a .name').text().trim();
    const pages = parseInt($('.tag-container:contains("Pages") .tags a .name').text().trim(), 10);
    const upload_date = $('time.nobold').attr('datetime').split('T')[0];

    const imageUrls = [];
    $('.thumb-container a').each((index, element) => {
      const imageUrl = $(element).find('img').attr('data-src') || $(element).find('img').attr('src');
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
    });

    return {
      gallery_id,
      title,
      parodies,
      tags,
      group,
      languages,
      categories,
      pages,
      upload_date,
      imageUrls
    };
  } catch (error) {
    console.error("Error scraping nhentai:", error);
    throw error;
  }
}


