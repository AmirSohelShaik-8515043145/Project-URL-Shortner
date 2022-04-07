const urlModel = require("../model/urlModel")
const shortid = require('short-id')
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    13953,
    "redis-13953.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("PVnXD258CEJmOiydei42mjXOCMuzKEQF", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


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
        let url = await GET_ASYNC(`${urlCode}`)

        if (url) {
            return res.status(302).redirect(JSON.parse(url))
        }
        else {
            let urlInMongoDB = await urlModel.findOne({ urlCode: urlCode });
            if (urlInMongoDB) {
                await SET_ASYNC(`${urlCode}`, JSON.stringify(urlInMongoDB.longUrl))
                return res.status(302).redirect(urlInMongoDB.longUrl);
            }
            else {
                return res.status(404).send({ status: false, msg: "No url found with this urlCode" })
            }
        }
    }
    catch (err) {
            console.log(error)
            return res.status(500).status(500).send({ status: true, message: err.message })
        }
    }


module.exports = {
        createShortUrl,
        getUrl
    }