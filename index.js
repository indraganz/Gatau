/** ==== { IMPORT MODULE } ==== **/
const express = require('express')
const cors = require('cors')
const path = require('path')
const jimp = require('jimp')
const fetch = require('node-fetch')
const FormData = require("form-data")
const axios = require('axios')
const bodyParser = require('body-parser')
const fs = require('fs')

/** ==== { IMPORT PLUGINS MODULE } ==== **/
const capcutdl = require('./plugins/Capcut-Downloader.js')
const { checkLimit, addUsage } = require('./plugins/checklim.js')
const ToolRemoveBg = require('./plugins/RemoveBackground.js')
const { sfiledl, sfileSearch } = require('./plugins/Sfile-Downloader.js')
const { spotifydl, searchSpotify } = require('./plugins/Spotify-Downloader.js')
const GDriveDl = require('./plugins/Drive-Downloader.js')
const twitterdl = require('./plugins/Twitter-Downloader.js')
const { remini } = require('./plugins/remini.js')
const Nekopoi = require('./plugins/nekopoi.js')
const { runtime } = require('./plugins/runtime'); 
const { igstalk } = require('./plugins/igstalk');
const { happyMod } = require('./plugins/happymod');
const { getIpInfo } = require('./plugins/ipinfo');
const { freepik } = require('./plugins/freepik.js')
const { nhentai, nhentaidl } = require('./plugins/nhentai.js')
const { hentaivox_s, hentaivox_dl } = require('./plugins/hentaifox.js')
const { A_genImage, A_style, A_sampler, A_models } = require('./plugins/text2image.js')
const { otakudesuDetail, otakudesuLatest, otakudesuSearch } = require('./plugins/otakudesu.js');
const { rembg, Cartoon } = require('./plugins/rmbg.js');
const { sdf, cosmix, trained, animagen, mixtral, emi, wish } = require('./plugins/imagen.js');
const { xnxxsearch, xnxxdl, wallpaper, pin, snapsave, ttstalk, chatbot, mediafireDl, pindl, llama2_ai, ttd, gpt3, gpt4, pixiv, pixivr18, vox, spe, askImage, ask, blackbox, gptRP, toAnime, openai } = require('./plugins/api.js');
const { translate } = require('bing-translate-api');
const { createImage, getList } = require("./plugins/animeAvatars.js")
const { vits_inference, vits_model, vits_emotion } = require('./plugins/rvc-vits.js')

/** ==== { INISIALISASI APLIKASI } ==== **/
const app = express()  // Inisialisasi app
const PORT = process.env.PORT || 3000

global.creator = 'Furina - Indraa Code'

const apiKeys = {
    'indrafarida': { usageCount: 0, limit: 100000 },
    'furinafree': { usageCount: 0, limit: 10000 },
    'IndraGanz': { usageCount: 0, limit: 50000 },
    'Salma': { usageCount: 0, limit: 2000 },
    'Farida': { usageCount: 0, limit: 500 },
};

/** ==== { KONFIGURASI APLIKASI } ==== **/
app.enable("trust proxy")
app.set("json spaces", 2)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/** ==== { MIDDLEWARE } ==== **/
// Middleware untuk memeriksa API key
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.query.apiKey || req.body.apiKey;

    if (!apiKeys[apiKey]) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    const { usageCount, limit } = apiKeys[apiKey];

    if (usageCount >= limit) {
        return res.status(403).json({ error: 'Usage limit exceeded' });
    }
    apiKeys[apiKey].usageCount += 1;

    req.apiKeyData = apiKeys[apiKey];
    next();
};
app.use('/api', apiKeyMiddleware);

/** ==== { ROUTES } ==== **/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './interface/index.html'))
})
app.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, './interface/contacts.html'))
})
app.get('/explanation', (req, res) => {
    res.sendFile(path.join(__dirname, './interface/explanation.html'))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './interface/login.html'))
})
app.get('/server', (req, res) => {
    res.sendFile(path.join(__dirname, './interface/server.js'))
})
app.get('/database', (req, res) => {
    res.sendFile(path.join(__dirname, './interface/database.js'))
})
app.get('/logadmin', (req, res) => {
    res.sendFile(path.join(__dirname, './interface/logadmin.html'))
})
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, './docs/endpoint.html'))
})

//nhentai
app.post('/api/nhentai/get', async (req, res) => {
    try {
        const query = req.body.nhURL
        const data = await nhentaidl(query);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

app.get('/api/checklimit', (req, res) => {
    const apiKey = req.query.apiKey;

    if (!apiKeys[apiKey]) {
        return res.json({ success: false, message: 'Invalid API Key' });
    }

    const { usageCount, limit } = apiKeys[apiKey];
    res.json({ success: true, usageCount: usageCount, limit: limit });
});


// Endpoint untuk menambah penggunaan (contoh)
app.post('/api/addUsage', async (req, res) => {
    const { apiKey, amount } = req.body;

    if (!apiKey || !amount || isNaN(amount)) {
        return res.status(400).json({ error: 'API key and amount are required.' });
    }

    try {
        const result = await checkLimit.addUsage(apiKey, parseInt(amount));
        res.json({
            message: 'Usage added successfully.',
            currentUsage: result.currentUsage,
            apiKeyLimit: result.apiKeyLimit
        });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.msg || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post('/api/runtime', async (req, res) => {
    try {
        const elapsedTime = await runtime(); // Call the runtime function
        res.status(200).json({
            status: 200,
            runtime: elapsedTime // Return the calculated runtime
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/api/ipinfo', async (req, res) => {
    const ip = req.query.ip;

    if (!ip) {
        return res.status(400).json({
            status: 400,
            error: 'IP address is required',
        });
    }

    try {
        const ipInfo = await getIpInfo(ip);
        res.status(200).json({
            status: 200,
            ipInfo,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const results = await happymod(query);
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/igstalk', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({
            status: 400,
            error: 'Instagram username is required',
        });
    }

    try {
        const profileData = await igstalk(username);
        res.status(200).json({
            status: 200,
            profileData,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

app.get('/api/nhentai/search', async (req, res) => {
    try {
        const query = req.query.query
        const data = await nhentai(query);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//freepik
app.get('/api/jp.freepik', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await freepik(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//nekopoi 
app.get('/api/nekopoi/search', async (req, res) => {
    try {
        const query = req.query.query
        const data = await Nekopoi.Search(query);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/nekopoi/latest', async (req, res) => {
    try {
        const data = await Nekopoi.Latest();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.post('/api/nekopoi/get', async (req, res) => {
	try {
		const url = req.body.url		
		if (!url) {
			return res.status(400)
				.json({
					error: 'Parameter "url" tidak ditemukan pastikan url gambar ada pada endpoint'
				});
		}
		const data = await Nekopoi.Get(url);
		res.status(200)
			.json({
				status: 200,
				creator: global.creator,
				result: {
				    data
				},
			});
	} catch (error) {
		res.status(500)
			.json({
				error: error.message
			});
	}
});


//openai
app.post('/api/bing-ai/chat', async (req, res) => {
    try {
        // Memeriksa apakah body request sesuai dengan skema yang diharapkan
        const messages = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: 'Field "messages" is required and must be a non-empty array'
            });
        }

        // Lakukan pemrosesan pesan di sini, misalnya dengan memanggil fungsi gptRP
        const data = await openai(messages);

        // Kirim respons dengan data yang diproses
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: {
                reply: data
            }
        });
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama pemrosesan
        res.status(500).json({
            error: error.message
        });
    }
});

//toAnime
app.post('/api/image-toAnime', async (req, res) => {
    try {
        const prompt = req.body.init_url; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: '"url" tidak ditemukan atau tidak di dukung'
                });
        }
        const data = await bufferlah(prompt);
        const pth = await toAnime(data)
        const data2 = await fetchBuffer(pth);
        const data3 = await remini(data2)
        res.set('Content-Type', "image/jpeg");
        res.send(data3);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//github search 
app.get('/api/github-search', async (req, res) => {
    try {
    const q = req.query.query
        const data = await fetchJson("https://api.github.com/search/repositories?q=" + q);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//ocr 
app.get('/api/image-ocr', async (req, res) => {
	try {
		const gambar = req.query.url		
		if (!gambar) {
			return res.status(400)
				.json({
					error: 'Parameter "url" tidak ditemukan pastikan url gambar ada pada endpoint'
				});
		}
		const output_text = await askImage("ambil smua text ini, susun dengan rapih tanpa tambahan text apapun", gambar);
		res.status(200)
			.json({
				status: 200,
				creator: global.creator,
				result: {
					output_text
				},
			});
	} catch (error) {
		res.status(500)
			.json({
				error: error.message
			});
	}
});

//image2hd
app.post('/api/image-enhance', async (req, res) => {
    try {
        const prompt = req.body.url; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: '"url" tidak ditemukan atau tidak di dukung'
                });
        }
        
        const pth = await fetchBuffer(prompt)
        const data = await remini(pth);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//text2image
app.post('/api/text2image/generate-image', async (req, res) => {
    try {
       const { model, prompt, negative_prompt, style, sampler } = req.body;
       const mod = await A_models()
       const st = await A_style()
       const sam = await A_sampler()
        if (!prompt && !negative_prompt) {
            return res.status(400)
                .json({
                    error: 'request body tidak valid'
                });
        }
        if (!model) {
            return res.status(400)
                .json({
                model: mod
                });
        }
        if (!st) {
            return res.status(400)
                .json({
                    style: st
                });
        }
        if (!sam) {
            return res.status(400)
                .json({
                    sampler: sam
                });
        }
  
  
        const data = await A_genImage(model, prompt, negative_prompt, style, sampler);
       const ptb = await fetchBuffer(data)
       const img = await remini(ptb)
          res.set('Content-Type', "image/jpeg");
          res.send(img);   
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/text2image/model', async (req, res) => {
    try {
        const data = await A_models();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/text2image/style', async (req, res) => {
    try {
        const data = await A_style();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/text2image/sampler', async (req, res) => {
    try {
        const data = await A_sampler();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//vits
app.get('/api/vits_inference', async (req, res) => {
    try {
       const { text, model_id } = req.query;
        if (!text) {
            return res.status(400)
                .json({
                    error: '"text" tidak ditemukan'
                });
        }
        if (!model_id) {
            return res.status(400)
                .json({
                    error: '"model_id" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
        const data = await vits_inference(text, model_id);
        //const au = await bufferlah(data)
        res.set('Content-Type', "audio/mpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/vits_inference/emotion', async (req, res) => {
    try {
       const { text, model_id, emotion } = req.query;
        if (!text) {
            return res.status(400)
                .json({
                    error: '"text" tidak ditemukan'
                });
        }
        if (!model_id) {
            return res.status(400)
                .json({
                    error: '"model_id" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
        if (!emotion) {
            return res.status(400)
                .json({
                    error: '"emotion" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
  
        const data = await vits_emotion(text, model_id, emotion);
      //  const aui = await bufferlah(data)
        res.set('Content-Type', "audio/mpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/vits_model', async (req, res) => {
    try {
        const data = await vits_model();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//gdrive 
app.get('/api/gdrive-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await GDriveDl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//Twitterdl
app.get('/api/twitter-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await twitterdl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//Spotifydl
app.get('/api/spotify-search', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const result = await searchSpotify(message);
        const results = result
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                results,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/spotify-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await spotifydl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//sfiledl
app.get('/api/sfile-search', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const result = await sfileSearch(message);
        const results = result
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                results,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/sfile-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await sfiledl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//rmbg2
app.post('/api/removeBackgroundV2', async (req, res) => {
    try {
        const message = req.body.url;
        
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await ToolRemoveBg(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//capcut
app.get('/api/capcut-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const data = await capcutdl(message);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: data
            
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//wishper 
app.post('/api/testing_array', async (req, res) => {
    try {
        const arrayData = req.body;
      //  const data = await bufferlah(arrayData)
            //  const text = await wish(data);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: {
                output: arrayData
            }

        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

app.post('/api/audio_whisper', async (req, res) => {
    try {
        const message = req.body.audioUrl;
        const data = await bufferlah(message)
        if (!message) {
            return res.status(400)
                .json({
                    error: ' "url" tidak ditemukan'
                });
        }
        const text = await wish(data);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: {
                output: text
            },
            model: {
                type: "whisper-large-v3",
                url: message
            }
        }); 
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

// Endpoint untuk /api/gpt-conversation
app.post('/api/gpt-conversation', async (req, res) => {
    try {
        // Memeriksa apakah body request sesuai dengan skema yang diharapkan
        const messages = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: 'Field "messages" is required and must be a non-empty array'
            });
        }

        // Lakukan pemrosesan pesan di sini, misalnya dengan memanggil fungsi gptRP
        const data = await gptRP(messages);

        // Kirim respons dengan data yang diproses
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: {
                reply: data
            },
            models: {
                model: "gpt-3,5 turbo"
            }
        });
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi selama pemrosesan
        res.status(500).json({
            error: error.message
        });
    }
});

//emi
app.get('/api/emi-xl', async (req, res) => {
    try {
        const message = req.query.prompt;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "prompt" tidak ditemukan'
                });
        }
        const data = await emi(message);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//mixtral
app.get('/api/mixtral-8x7B', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await mixtral(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    output_text: data
                },
                models: {
                    name: "Mixtral-8x7B-Instruct"
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//animagen
app.post('/api/animagen_v1.0', async (req, res) => {
    try {
        const prompt = req.body.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "promot" tidak ditemukan'
                });
        }
        const data = await animagen(`best quality,` + prompt);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//hf loader
app.post('/api/hugging_face_model_loader', async (req, res) => {
    try {
        const hfurl = req.body.model;
        const hfkey = req.body.hfkey; 
        const prompt = req.body.prompt// Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "promot" tidak ditemukan'
                });
        }
        if (!hfkey && !hfurl) {
            return res.status(400)
                .json({
                    error: 'Parameter "apikey or url" tidak ditemukan'
                });
        }
        const data = await trained(prompt, hfkey, hfurl);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//cosmix sdxl
app.post('/api/cosmix_SDXL_LoRA', async (req, res) => {
    try {
        const prompt = req.body.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "promot" tidak ditemukan'
                });
        }
        const data = await cosmix(`best quality,` + prompt);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//stable diffusion
app.get('/api/stable_diffusion_xl', async (req, res) => {
    try {
        const prompt = req.query.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "promot" tidak ditemukan'
                });
        }
        const data = await sdf(`best quality,` + prompt);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//hentaifox 
app.get('/api/hentaifox_search', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const result = await hentaivox_s(message)
       
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/hentaifox_get', async (req, res) => {
    try {
        const message = req.query.link;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "link" tidak ditemukan'
                });
        }
        const result = await hentaivox_dl(message)
       
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//pinterest download 
app.get('/api/pinterest-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await pindl(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//mediafire
app.get('/api/mediafire', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await mediafireDl(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//chatbot 
app.get('/api/chatbot_bitrough', async (req, res) => {
    try {
        const message = req.query.query;
        const lang = req.query.lang;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const reply = await chatbot(message, lang);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                reply,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//ttstalk
app.get('/api/tiktok_stalk', async (req, res) => {
    try {
        const message = req.query.username;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "username" tidak ditemukan'
                });
        }
        const result = await ttstalk(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

// igstalk
app.get('/api/instagram_stalk', async (req, res) => {
    try {
        const user = req.query.user;
        if (!user) {
            return res.status(400).json({
                error: 'Parameter "user" tidak ditemukan'
            });
        }
        const result = await igstalk(user);
        res.status(200).json({
            status: 200,
            creator: global.creator,
            result: result,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

//otakudesu 
app.get('/api/otakudesu_episode', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await otakudesuDetail(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

app.get('/api/otakudesu_detail', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await otakudesuDetail(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

app.get('/api/otakudesu_search', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const result = await otakudesuSearch(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

app.get('/api/otakudesu_latest', async (req, res) => {
    try {
        const result = await otakudesuLatest();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//Avatar anime create 
app.get('/api/create_animeAvatar', async (req, res) => {
    try {
        const id = req.query.id;
        const signature = req.query.signature;
        const background = req.query.background_text;
        const color = req.query.color;
        if (!id && !signature && !background) {
            return res.status(400)
                .json({
                    error: 'Parameter tidak ditemukan'
                });
        }
        const data = await createImage(id, signature, background, color)
        res.set('Content-Type', "image/png");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/GetAvatar_id', async (req, res) => {
    try {

        const text = await getList()
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                avatar_id: text.data,

            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//dalle-mini 
app.get('/api/dalle-mini', async (req, res) => {
    try {
        const prompt = req.query.prompt; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "prmpt" tidak ditemukan'
                });
        }
        const data = await fetchBuffer("https://cute-tan-gorilla-yoke.cyclic.app/imagine?text=" + prompt)
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//imagine
app.get('/api/removeBackground', async (req, res) => {
    try {
        const prompt = req.query.url; // Prompt to generate text to image.
        if (!prompt) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await rembg(prompt);
        res.set('Content-Type', "image/jpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

//tiktok
app.get('/api/tiktok-dl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const result = await ttd(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message + "check support lang in https://rentry.co/3qi3wqnr/raw"
            });
    }
});
//translate
app.get('/api/gpt-translate', async (req, res) => {
    try {
        const message = req.query.text;
        const target = req.query.target

        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        if (!target) {
            return res.status(200)
                .json({
                    error: 'Parameter "target" tidak ditemukan'
                });
        }
        const data = await gptTR(message, target);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
                suport_all_lang: {
                    check_url: "https://rentry.co/3qi3wqnr/raw"
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message + "check support lang in https://rentry.co/3qi3wqnr/raw"
            });
    }
});
//GPT 3&4
app.get('/api/gpt-3_5-turbo', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await gpt3(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    reply: data
                },
                input: {
                    text: message
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/gpt-4_adv', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await gpt4(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    reply: data
                },
                input: {
                    text: message
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//blackbox 
app.get('/api/blackbox', async (req, res) => {
    try {
        const message = req.query.text;
        const web = req.query.webSearchMode
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        if (!web) {
            return res.status(400)
                .json({
                    error: 'Parameter tidak ditemukan'
                });
        }
        if (web == "false") {
            const data2 = await blackbox(message, false);
            const bburl = "https://www.blackbox.ai/?q=" + encodeURIComponent(message)
            res.status(200)
                .json({
                    status: 200,
                    creator: global.creator,
                    result: {
                        text: data2,
                        webSearch: web,
                        api_url: {
                            url: bburl
                        }
                    },
                });
        } else if (web == "true") {
            const data = await blackbox(message, true);
            const bburl = "https://www.blackbox.ai/?q=" + encodeURIComponent(message)
            res.status(200)
                .json({
                    status: 200,
                    creator: global.creator,
                    result: {
                        text: data,
                        webSearch: web,
                        api_url: {
                            url: bburl
                        }
                    },
                });
        }
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//endpoint gemini
app.get('/api/gemini', async (req, res) => {
    try {
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        const data = await ask(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
// endpoint gemini-image
app.get('/api/gemini-vision', async (req, res) => {
	try {
		const gambar = req.query.url
		const message = req.query.text;
		if (!message) {
			return res.status(400)
				.json({
					error: 'Parameter "text" tidak ditemukan'
				});
		}
		if (!gambar) {
			return res.status(400)
				.json({
					error: 'Parameter "url" tidak ditemukan pastikan url gambar ada pada endpoint'
				});
		}
		const data = await askImage(message, gambar);
		res.status(200)
			.json({
				status: 200,
				creator: global.creator,
				result: {
					data
				},
			});
	} catch (error) {
		res.status(500)
			.json({
				error: error.message
			});
	}
});

//endpoint VOIXEVOX 
app.get('/api/voicevox-synthesis', async (req, res) => {
    try {
        const speakerr = req.query.speaker
        const message = req.query.text;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "text" tidak ditemukan'
                });
        }
        if (!speakerr) {
            return res.status(400)
                .json({
                    error: 'Parameter "speaker" tidak ditemukan pastikan susunan endpoint nya sudah benar'
                });
        }
        const data = await vox(message, speakerr);
        res.set('Content-Type', "audio/mpeg");
        res.send(data);
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/voicevox-speaker', async (req, res) => {
    try {
        const data = await spe();
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: {
                    data
                },
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//pixiv 
app.get('/api/pixiv', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await pixiv(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/pixiv-r18', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await pixivr18(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                result: data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//xnxx
app.get('/api/xnxxdl', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await xnxxdl(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
app.get('/api/xnxxsearch', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await xnxxsearch(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//Pinterest 
app.get('/api/pinterest', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await pin(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//wallpaper
app.get('/api/wallpaper', async (req, res) => {
    try {
        const message = req.query.query;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "query" tidak ditemukan'
                });
        }
        const data = await wallpaper(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
//Facebook & Instagram
app.get('/api/Instagram', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await snapsave(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});

app.get('/api/Facebook', async (req, res) => {
    try {
        const message = req.query.url;
        if (!message) {
            return res.status(400)
                .json({
                    error: 'Parameter "url" tidak ditemukan'
                });
        }
        const data = await snapsave(message);
        res.status(200)
            .json({
                status: 200,
                creator: global.creator,
                data,
            });
    } catch (error) {
        res.status(500)
            .json({
                error: error.message
            });
    }
});
// Handle error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500)
        .send('Something broke!');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

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
    var kiyomasa = await oyy.resize(512, 512).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}
async function fetchJson(url, options = {}) {
    const result = await (await fetch(url, {
            headers: options
        }))
        .json()
    return result;
}

//translate
async function gptTR(text, tar) {
    return translate(text, null, tar)
}



module.exports = app
