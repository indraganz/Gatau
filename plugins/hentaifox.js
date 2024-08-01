const axios = require('axios');
const cheerio = require('cheerio');


exports.hentaivox_s = async (qq) => {
return new Promise(async (resolve, reject) => {
const url = `https://hentaifox.tv/search/?q=${encodeURIComponent(qq)}`

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const results = [];

    $('div.sub_overview a.a_item').each((index, element) => {
      const title = $(element).find('div.video_title').text().trim();
      const link = 'https://hentaifox.tv' + $(element).attr('href');
      const thumbnail = $(element).find('img').attr('src');
      
      
      results.push({ title, link, thumbnail });
    });

    console.log(results);
    resolve(results)
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
  })
  }


exports.hentaivox_dl = async (url) => {
return new Promise(async (resolve, reject) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const info = {};

        const coverSrc = $('div.info_bottom div.cover img').attr('src');
        info.cover = coverSrc ? `https://hentaifox.tv${coverSrc}` : '';

        const iframeSrc = $('div.player iframe').attr('src');
        const stre = iframeSrc ? iframeSrc : '';
        const stree = await fetchVideoUrl(stre)
        info.streaming = stree.video_url


        const rInfoB = {};
        $('div.info_bottom div.r_info_b div.flex_wrap div.r_item').each((index, element) => {
            //const label = $(element).find('span').text().trim();
            const valueElement = $(element).find('a, .sub_r, h2');
            let value;

           if (valueElement.is('a')) {
                value = valueElement.text().trim();
            } else if (valueElement.is('.sub_r')) {
                value = valueElement.text().trim();
            } else if (valueElement.is('h2')) {
                value = valueElement.find('span.sub_t').map((i, el) => $(el).text().trim()).get();
            }

            rInfoB.alternate = value;
        });
        info.r_info_b = rInfoB;


        const tags = $('div.video_tags a').map((index, element) => $(element).text().trim()).get();
        info.tags = tags;


        const description = $('div.video_description p').text().trim();
        info.description = description;


        const seriesTitle = $('div.more_from_series .mfs_title strong').text().trim();
        info.seriesTitle = `More from ${seriesTitle} series:`;

      
        const episodes = [];
        $('div.more_from_series .mfs_item').each((index, element) => {
            const episode = {};
            const title = $(element).find('.title a').text().trim();
            const link = $(element).find('.title a').attr('href');
            const posterSrc = $(element).find('.poster img').attr('src');
            const views = $(element).find('.views').text().trim();

            episode.title = title;
            episode.link = `https://hentaifox.tv${link}`;
            episode.poster = `https://hentaifox.tv${posterSrc}`;
            episode.views = views;

            episodes.push(episode);
        });
        info.episodes = episodes;


        console.log(info)
        resolve(info)

    } catch (error) {
        console.error('Error fetching data:', error);
    }
})
}



async function fetchVideoUrl(urls) {
return new Promise(async (resolve, reject) => {
  try {
    const response = await axios.get(urls);
    const html = response.data;
    const $ = cheerio.load(html);

    
    const iframeSrc = $('iframe').attr('src');
    if (iframeSrc) {
      const responseData = {
        video_url: iframeSrc
      };
      console.log(responseData);
      resolve(responseData)
    } else {
      console.error('Tag <iframe> tidak ditemukan.');
    }
  } catch (error) {
    console.error('Error fetching the page:', error.message);
  }
})
}