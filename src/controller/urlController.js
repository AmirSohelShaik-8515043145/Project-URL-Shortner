const urlModel = require("../model/urlModel")
const shortid = require('short-id')


const createShortUrl = async (req, res) => {
    try {
        // Validation for BaseUrl :
        let baseUrl = 'http://localhost:3000';
        if (!(/^https?:\/\/\w/).test(baseUrl)) { return res.status(400).send({ status: false, msg: "Please check your Base Url, Provide a valid One." }) }

        // UrlCode Generate :
        let urlCode = shortid.generate()

        // Validation for Long Url :
        let longUrl = (req.body.longUrl).trim();
        if (!longUrl) { return res.status(400).send({ status: false, msg: "Please provide a longUrl into postman" }) }
        if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(longUrl))) { return res.status(400).send({ status: false, msg: "Please provide a valid longUrl" }) }
        let duplicateLongUrl = await urlModel.findOne({ longUrl: longUrl })
        if (duplicateLongUrl) { return res.status(302).send({ msg: "There is already a shortUrl present in the Database with this Url", "Use this shortUrl": duplicateLongUrl.shortUrl }) }

        // Generate ShortUrl :
        let shortUrl = baseUrl + '/' + urlCode;

        let data = {
            urlCode: urlCode,
            longUrl: longUrl,
            shortUrl: shortUrl
        }
        console.log(data)
        let urlDetails = await urlModel.create(data)

        let result = {
            urlCode: urlDetails.urlCode,
            longUrl: urlDetails.longUrl,
            shortUrl: urlDetails.shortUrl
        }
        return res.status(400).send({ status: true, data: result })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const getUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        let url = await urlModel.findOne({ urlCode: urlCode })

        if (!url) { return res.status(404).send({ status: false, msg: "No url found with this urlCode" }) }
        if (url) { return res.status(200).redirect(url.longUrl) }
    }
    catch (err) {
        return res.status(500).send({ status: true, message: err.message })
    }
}


module.exports = {
    createShortUrl,
    getUrl
}