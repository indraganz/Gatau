const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch');
const got = require('got')
const { JSDOM } = require('jsdom')
const path = require('path');
const jimp = require('jimp');
const FormData = require("form-data");
const {
    G4F,
    chunkProcessor
} = require("g4f")
const g4f = new G4F()
const googlekey = "AIzaSyAY8DjFZHICDZ-TeHNN6lnEFoB-qczmXxE"


//fungsi random 
async function GetRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
//fungsi extract number
function extractNumber(url) {
    const match = url.match(/\/(\d+)/);
    return match ? match[1] : null;
}
//fungsi buffer 
async function fetchBuffer(file, options = {}) {
    const bufet = await (await axios.get(file, {
            responseType: "arraybuffer",
            headers: options
        }))
        .data
    return bufet;
}
async function bufferlah(hm) {
    const imageUrl = hm;
    const imagePath = 'gambar.jpg';
    const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'binary');
    return buffer;
}
async function Resize(buffer) {
    var oyy = await jimp.read(buffer);
    var kiyomasa = await oyy.resize(512, 512)
        .getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}
async function fetchJson(url, options = {}) {
    const result = await (await fetch(url, {
            headers: options
        }))
        .json()
    return result;
}

  exports.xnxxdl = async (URL) => {
	return new Promise((resolve, reject) => {
		fetch(`${URL}`, {method: 'get'})
		.then(res => res.text())
		.then(res => {
			let $ = cheerio.load(res, {
				xmlMode: false
			});
			const title = $('meta[property="og:title"]').attr('content');
			const duration = $('meta[property="og:duration"]').attr('content');
			const image = $('meta[property="og:image"]').attr('content');
			const videoType = $('meta[property="og:video:type"]').attr('content');
			const videoWidth = $('meta[property="og:video:width"]').attr('content');
			const videoHeight = $('meta[property="og:video:height"]').attr('content');
			const info = $('span.metadata').text();
			const videoScript = $('#video-player-bg > script:nth-child(6)').html();
			const files = {
				low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
				high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
				HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
				thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
				thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
				thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
				thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1],
			};
			resolve({
				result: {
					title,
					URL,
					duration,
					image,
					videoType,
					videoWidth,
					videoHeight,
					info,
					files
				}
			})
		})
		.catch(err => reject({code: 503, status: false, result: err }))
	})
                        }
   /* XnxxSearch
    * @param {String} query
    */
   exports.xnxxsearch = async (query) => {
	return new Promise((resolve, reject) => {
		const baseurl = 'https://www.xnxx.com'
		fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'})
		.then(res => res.text())
		.then(res => {
			let $ = cheerio.load(res, {
				xmlMode: false
			});
			let title = [];
			let url = [];
			let desc = [];
			let results = [];

			$('div.mozaique').each(function(a, b) {
				$(b).find('div.thumb').each(function(c, d) {
					url.push(baseurl+$(d).find('a').attr('href').replace("/THUMBNUM/", "/"))
				})
			})
			$('div.mozaique').each(function(a, b) {
				$(b).find('div.thumb-under').each(function(c, d) {
					desc.push($(d).find('p.metadata').text())
					$(d).find('a').each(function(e,f) {
					    title.push($(f).attr('title'))
					})
				})
			})
			for (let i = 0; i < title.length; i++) {
				results.push({
					title: title[i],
					info: desc[i],
					link: url[i]
				})
			}
			resolve({
				result: results
			})
		})
		.catch(err => reject({code: 503, status: false, result: err }))
	})
   }

exports.pin = async (querry) => {
	return new Promise((resolve,reject) => {
		 axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
			headers: {
			"cookie" : "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
		}
			}).then(({ data }) => {
		const $ = cheerio.load(data)
		const result = [];
		const hasil = [];
   		 $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src')
            result.push(link)
		});
   		result.forEach(v => {
		 if(v == undefined) return
		 hasil.push(v.replace(/236/g,'736'))
			})
			hasil.shift();
		resolve(hasil)
		})
	})
}

exports.wallpaper = async (title, page = '1')  => {
	return new Promise((resolve, reject) => {	
		axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`).then(({	
			data	
		}) => {	
			let $ = cheerio.load(data)	
			let hasil = []	
			$('div.grid-item').each(function(a, b) {	
				hasil.push({	
					title: $(b).find('div.info > a > h3').text(),	
					type: $(b).find('div.info > a:nth-child(2)').text(),	
					source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),	
					image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]	
				})	
			})	
			resolve(hasil)	
			
		})	
	})	
}

  exports.snapsave = async (url) =>{
  return new Promise(async (resolve) => {
  try {
  function decodeSnapApp(args) {
  let [h, u, n, t, e, r] = args
  // @ts-ignore
  function decode (d, e, f) {
  const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
  let h = g.slice(0, e)
  let i = g.slice(0, f)
  // @ts-ignore
  let j = d.split('').reverse().reduce(function (a, b, c) {
  if (h.indexOf(b) !== -1)
  return a += h.indexOf(b) * (Math.pow(e, c))
  }, 0)
  let k = ''
  while (j > 0) {
  k = i[j % f] + k
  j = (j - (j % f)) / f
  }
  return k || '0'
  }
  r = ''
  for (let i = 0, len = h.length; i < len; i++) {
  let s = ""
  // @ts-ignore
  while (h[i] !== n[e]) {
  s += h[i]; i++
  }
  for (let j = 0; j < n.length; j++)
  s = s.replace(new RegExp(n[j], "g"), j.toString())
  // @ts-ignore
  r += String.fromCharCode(decode(s, e, 10) - t)
  }
  return decodeURIComponent(encodeURIComponent(r))
  }
  function getEncodedSnapApp(data) {
  return data.split('decodeURIComponent(escape(r))}(')[1]
  .split('))')[0]
  .split(',')
  .map(v => v.replace(/"/g, '').trim())
  }
  function getDecodedSnapSave (data) {
  return data.split('getElementById("download-section").innerHTML = "')[1]
  .split('"; document.getElementById("inputData").remove(); ')[0]
  .replace(/\\(\\)?/g, '')
  }
  function decryptSnapSave(data) {
  return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)))
  }
  const html = await got.post('https://snapsave.app/action.php?lang=id', {
  headers: {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'content-type': 'application/x-www-form-urlencoded','origin': 'https://snapsave.app',
  'referer': 'https://snapsave.app/id',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
  },
  form: { url }
  }).text()
  const decode = decryptSnapSave(html)
  const $ = cheerio.load(decode)
  const results = []
  if ($('table.table').length || $('article.media > figure').length) {
  const thumbnail = $('article.media > figure').find('img').attr('src')
  $('tbody > tr').each((_, el) => {
  const $el = $(el)
  const $td = $el.find('td')
  const resolution = $td.eq(0).text()
  let _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick')
  const shouldRender = /get_progressApi/ig.test(_url || '')
  if (shouldRender) {
  _url = /get_progressApi\('(.*?)'\)/.exec(_url || '')?.[1] || _url
  }
  results.push({
  resolution,
  thumbnail,
  url: _url,
  shouldRender
  })
  })
  } else {
  $('div.download-items__thumb').each((_, tod) => {
  const thumbnail = $(tod).find('img').attr('src')
  $('div.download-items__btn').each((_, ol) => {
  let _url = $(ol).find('a').attr('href')
  if (!/https?:\/\//.test(_url || '')) _url = `https://snapsave.app${_url}`
  results.push({
  thumbnail,
  url: _url
  })
  })
  })
  }
  if (!results.length) return resolve({ msg: `Blank data` })
  return resolve({ data: results })
  } catch (e) {
  return resolve({ msg: e.message })
  }
  })
}

const axios = require('axios');
const cheerio = require('cheerio');

exports.alk = async (username) => {
    return new Promise(async resolve => {
        let retryCount = 0;
        while (retryCount < 3) {
            try {
                const response = await axios.get(`https://tiktok.com/@${username}`);
                const $ = cheerio.load(response.data);

                const jsonData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();
                const parsedData = JSON.parse(jsonData);
                const userData = parsedData.__DEFAULT_SCOPE__['webapp.user-detail'].userInfo;

                const userInfo = {
                    data: {
                        ...userData.user,
                        ...userData.stats
                    }
                };

                resolve(userInfo);
                return;
            } catch (err) {
                console.error(`Attempt ${retryCount + 1} failed: ${err.message}`);
                retryCount++;
            }
        }
        throw new Error('Failed to fetch user data after 3 attempts.');
    });
};

exports.igstalk = async (user) => {
    return new Promise(async resolve => {
        let retryCount = 0;
        while (retryCount < 3) {
            try {
                const url = `https://dumpoir.com/v/${user}`;
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);

                const profileImage = $('div.avatar img').attr('src');
                const username = $('h1').text().trim();
                const name = $('h2').text().trim() || '-';
                const bio = $('div.text-sm.font-serif').text().trim() || '-';
                const postsCount = parseInt($('.stat-value.text-primary').text().trim(), 10) || 0;
                const followers = $('div.stat-value.text-secondary').eq(0).text().trim() || 0;
                const following = parseInt($('div.stat-value').eq(2).text().trim()) || 0;

                const userInfo = {
                    creator: 'Furinaa - Indraa Code',
                    status: true,
                    data: {
                        profile_image: profileImage,
                        username: username,
                        name: name,
                        bio: bio,
                        followers: followers,
                        following: following,
                        posts_count: postsCount
                    }
                };

                resolve(userInfo);
                return;
            } catch (err) {
                console.error(`Attempt ${retryCount + 1} failed: ${err.message}`);
                retryCount++;
            }
        }
        throw new Error('Failed to fetch user data after 3 attempts.');
    });
};

exports.chatbot = async (text, lang = 'id') => {
    return new Promise(async resolve => {
        try {
            let form = new URLSearchParams();
            form.append('text', text);
            form.append('lc', lang);
            const json = await (await axios.post('https://api.simsimi.vn/v1/simtalk', form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })).data;
            resolve({
                msg: json.message
            });
        } catch (e) {
            resolve({
                msg: e.message
            });
        }
    });
};

exports.mediafireDl = async (url) => {
const res = await axios.get(url) 
const $ = cheerio.load(res.data)
const hasil = []
const link = $('a#downloadButton').attr('href')
const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('                         ', '')
const seplit = link.split('/')
const nama = seplit[5]
mime = nama.split('.')
mime = mime[1]
hasil.push({ nama, mime, size, link })
return hasil
}

const pinterestHeaders = {
    "sec-ch-ua": "\"Chromium\";v=\"90\", \"Opera GX\";v=\"76\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "upgrade-insecure-requests": "1",
    "cookie": '_b="AV/K4MPPSOhA85mqWtEGnzzVEavd7ss6OigPSN2qq1c2gIDCN9GIOv88dRkR9X7k1Js="; _auth=1; _pinterest_sess=TWc9PSZndXd6Ylo0emM4VXNwWW9Ua0xNTmIrV3YwenVreXNmS3Bpd04wMUx4VFlDc2xyaXY5a2NqWE9CMWZIUVZBYytmaWpNVElQWkhDQTAycHNVYmFyZ0hrMjJjRVNZZkJGN0tVOXMxazBBMUtpM0ZyOGRFWlQrMm56Y3l3UEkvTjFTWG5uc2ZuSTY5V01GTS9oWmlSaVQvZUwxemhTMG1HK0tlQy82Ni9VM2xzYnpEVzJHWTBYWnM1YXNlQ2NGS29vZ3N4M011eFF1ZmdBR3VDSFlZZWJIVUo5YTd0S205YkVyWlBHNVQvdGRYaHIzOWRzb0czN1JEM2x3aEtLNEVPNHpKMnp0bVVnNVF2WDFRbTJlWDdVMk9HUng0MVpwYitnQjFPU2RBRlY0QURlaVBndTB1TjYyS3phR2RpNWVYZEhkR1paTDBOVUtGOXZJdk15SEJFNTV2a1VVdGd1enRGMUZkRXB1VUVXeEs0S3lTakF4eFFZVFhlSGhGSm5YRThGcTZrRUJEY2wzQkVNNDZnODZnOE1EQ2hUTm5oOHBXaTgvYjA3enlyYlZwVEpaa1B2YjNtSUQ1WVRaK0gwRm9STUlTaS9SSEdhWXh4MWhuaENidk5CY0d2SXZabUpaWTQ4YWlRTWRoclVaVmphdHBrQ3F4YTZ2V0FJclA1UFcwQ0tndFR3ckZYZm1ySkFQbmNWZk15UVpnSW5TS0lzZEhJQWh4eEtpaEZXU3c4UVV0bEtWRUozTFZOV08xNWdicC9VVUpQdHk4b05wd1k5ZWhCSGpwVUxoTUJtYkNpenNvbEFuZUwzVmE0clRybGRRVmloeTNvb2k3R3RXQXlLQUxKNVFtQUZ5ajRDcjlEOEYxbUNGdWxtb3NQWGNBV21vSElzbXZML0tHL3YvemJEeWRQWVdFOUhMQUYzVkhLUTh4d2oyMU1mQkZBSXFHYU80SGRFL1dqVFgzdzBUczdsVHhIbHYxamx2Tm8xT1ZteUloRGtvQUI0NWVjQ2ZVN3RMaXVOaWtJSUprTlJVVUxEMXpZNGlYNktSOU4wdGZJVVg1bGg4NWVSdWZXY3ZYNE5FPSZhZHM5MGUxR1hkd3d2bU5YNG9iV1E5WVNmRFE9; csrftoken=ec0ac84a7ae235f5b8ab7d63bbe380f3; _routing_id="fb765351-a028-4475-80ec-79cb4bc417e2"; sessionFunnelEventLogged=1'
}
exports.pindl = async (url) => {
        try {
            const uri = await axios.get(url).then(res => {
                let nganu = new URL(res.request.res.responseUrl)
                pathname = nganu.pathname
                return nganu.origin + pathname.slice(0, pathname.lastIndexOf('/'));
            })
            const { data } = await axios.get(uri, { headers: pinterestHeaders })
            const dom = new JSDOM(data).window.document
            let re = JSON.parse(dom.getElementById('__PWS_DATA__').innerHTML)
            const json = re.props.initialReduxState.pins[Object.keys(re.props.initialReduxState.pins)]
            let result = {
                title: json.title,
                media: json.videos !== null ? json.videos.video_list[Object.getOwnPropertyNames(json.videos.video_list)[0]] : json.images.orig,
                extension: json.videos !== null ? 'mp4' : 'jpg',
                created_at: json.created_at,
                id: json.id,
                ...json
            }
            return result
        } catch (error) {
            return error
        }
    }
exports.ttd = async (url) => {
    try {
    const apiUrl = 'https://snapdouyin.app/wp-json/aio-dl/video-data/';

    const headers = {
    "content-type": "application/x-www-form-urlencoded",
}

        const params = new URLSearchParams();
        params.append('url', url);

        const response = await fetch(apiUrl, { method: "POST", body: params, headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        throw new Error(`An error occurred: ${error.message}`);
    }
}



//function GPT 3
exports.gpt3 = async (text) => {
    const messages = [

        {
            role: "system",
            content: "Saya adalah asisten virtual yang dikembangkan oleh OpenAI dengan basis gpt-3.5-turbo. Saya dirancang untuk membantu Anda dengan pertanyaan dan informasi yang Anda perlukan. Ada yang bisa saya bantu?"
        },

        {
            role: "user",
            content: text
        },

    ];
    const options = {
        provider: g4f.providers.GPT,
        model: "gpt-3.5-turbo",
        debug: true,
        proxy: ""
    }
    return g4f.chatCompletion(messages, options);
}
exports.gpt4 = async (text) => {
    const messages = [

        {
            role: "system",
            content: "Saya adalah asisten virtual yang dikembangkan oleh OpenAI dengan basis gpt-4. Saya dirancang untuk membantu Anda dengan pertanyaan dan informasi yang Anda perlukan. Ada yang bisa saya bantu?"
        },

        {
            role: "user",
            content: text
        },

    ];
    const options = {
        model: "gpt-4",
        debug: true,
        retry: {
            times: 3,
            condition: (text) => {
                const words = text.split(" ");
                return words.length > 10;
            }
        },
        output: (text) => {
            return text
        }
    };
    return g4f.chatCompletion(messages, options);
}

//function pixiv
exports.pixiv = async (text) => {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=0&num=20&keyword=" + text)
        .then(data => data.data.data);
}

exports.pixivr18 = async (text) => {
    return axios.get("https://api.lolicon.app/setu/v2?size=regular&r18=1&num=20&keyword=" + text)
        .then(data => data.data.data);
}

//fungsi VOICEVOX
exports.vox = async (text, speaker) => {
    const keysi = await GetRandom(["R_m8Q8e8s2r808k", "U282o-0-04r-x_O"])
    const urlnya =
        `https://deprecatedapis.tts.quest/v2/voicevox/audio/?key=${keysi}&speaker=${speaker}&pitch=0&intonationScale=1&speed=1&text=${encodeURIComponent(text)}`
    let buf = fetchBuffer(urlnya)
    return buf;
}
//fungsi Speaker VOICEVOX
exports.spe = async () => {
    const urlnya = await fetchJson(`https://deprecatedapis.tts.quest/v2/voicevox/speakers/?key=R_m8Q8e8s2r808k`)
    return urlnya;
}
//fungsi gemini
exports.ask = async (inputText) => {
    // For text-only input, use the gemini-pro model
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + googlekey;
    const headers = {
        'Content-Type': 'application/json'
    };
    const data = {
        contents: [{
            parts: [{
                text: inputText
            }]
        }]
    };
    const response = await axios.post(url, data, {
        headers
    })
    console.log(response.data.candidates[0].content.parts[0].text);
    return response.data.candidates[0].content.parts[0].text;
}
exports.askImage = async (inputText, inputImage) => {
	try {
		const buffer = await bufferlah(inputImage);
		const resizedBuffer = await Resize(buffer);

		const requestBody = {
			"contents": [
				{
					"parts": [
						{
							"text": inputText
						},
						{
							"inline_data": {
								"mime_type": "image/jpeg",
								"data": resizedBuffer.toString('base64')
							}
						}
					]
				}
			]
		};

		const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${googlekey}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});

		const data = await response.json();
		console.log('API Response:', data); // Log the response for debugging

		// Check if candidates exist and have at least one element
		if (!data.candidates || data.candidates.length === 0) {
			throw new Error('Tidak ada kandidat dalam respons API');
		}

		// Check if the expected structure exists
		if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
			throw new Error('Struktur data respons tidak sesuai');
		}

		return data.candidates[0].content.parts[0].text;
	} catch (error) {
		console.error('Error in askImage:', error); // Log detailed error
		throw new Error('Terjadi kesalahan saat memproses permintaan: ' + error.message);
	}
};

//fungsi black box
exports.blackbox = async (content, web) => {
    const url = "https://www.blackbox.ai/api/chat"
    const headers = {
        "Accept": "*/*",
        "Accept-Language": "id-ID,en;q=0.5",
        "Referer": "https://www.blackbox.ai/",
        "Content-Type": "application/json",
        "Origin": "https://www.blackbox.ai",
        "Alt-Used": "www.blackbox.ai"
    }
    const data = {
        messages: [{
            role: "user",
            content
        }],
        id: "chat-free",
        previewToken: null,
        userId: "",
        codeModelMode: true,
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: "You are BlacBox Ai, a useful AI Model for millions of developers using Blackbox Code Chat that will answer coding questions and help them when writing code.",
        maxTokens: 1024,
        webSearchMode: web,
        promptUrls: "",
        isChromeExt: false,
        githubToken: null
    }
    try {
        const blackboxResponse = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        })
        const blackboxData = await blackboxResponse.text()
        return blackboxData
    } catch (error) {
        console.error("Error fetching data:", error)
        return null
    }
}
exports.gptRP = async (data) => {
const messages = data; 

return g4f.chatCompletion(messages)
}

exports.toAnime = async (buffer) => {
    try {
        
        const base64String = buffer.toString('base64');

        const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
            data: `data:image/png;base64,${base64String}`,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return 'https://www.drawever.com' + apiResponse.data.urls[1] || 'https://www.drawever.com' + apiResponse.data.urls[0];
    } catch (error) {
        console.log(error)
    }
}


exports.openai = async (messages) => {
    return new Promise(async resolve => {
        const response = await axios.post('https://nexra.aryahcr.cc/api/chat/complements', {
            messages: messages,
            conversation_style: "Balanced",
            markdown: false,
            stream: true,
            model: "Bing"
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: "stream"
        });

        let accumulatedChunks = [];
        let tmp = null;

        response.data.on("data", (chunk) => {
            let chk = chunk.toString().split("");

            chk.forEach((data) => {
                try {
                    let parsedData = JSON.parse(data);
                    if (parsedData.message) {
                        accumulatedChunks.push(parsedData.message);
                    }
                    tmp = null;
                } catch (e) {
                    if (tmp === null) {
                        tmp = data;
                    } else {
                        tmp += data;
                        try {
                            let parsedData = JSON.parse(tmp);
                            if (parsedData.message) {
                                accumulatedChunks.push(parsedData.message);
                            }
                            tmp = null;
                        } catch (e) {
                            // Continue accumulating data
                        }
                    }
                }
            });
        });

        response.data.on("end", () => {
            if (accumulatedChunks.length > 0) {
                let longestMessage = accumulatedChunks
                    .filter(message => message !== null) // Filter out null values
                    .reduce((longest, current) => {
                        return current.length > longest.length ? current : longest;
                    }, "");

                console.log(longestMessage);
                resolve(longestMessage)
            } else {
                console.log({
                    code: 500,
                    status: false,
                    error: "INTERNAL_SERVER_ERROR",
                    message: "No valid message received"
                });
            }
        });

        response.data.on("error", (err) => {
            console.log({
                code: 500,
                status: false,
                error: "INTERNAL_SERVER_ERROR",
                message: "Stream error occurred"
            });
        });
})
};

