 const { otakudesu } = require("@xct007/frieren-scraper") 
const axios = require("axios")

exports.otakudesuDetail = async (url) => {
 let result = await otakudesu.detail(url)
return result 
}

exports.otakudesuSearch = async (text) => {
let res = await axios.get(`https://otakudesu-unofficial-api.rzkfyn.xyz/v1/search/${text}`)
return res.data.data
}

exports.otakudesuLatest = async () => {
let res = await axios.get("https://otakudesu-unofficial-api.rzkfyn.xyz/v1/ongoing-anime")
return res.data.data
}
