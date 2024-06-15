import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import UserAgent from 'user-agents'

const router = express.Router()

router.get('/:user_id/:product_url*', async (req, res) => {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString()
    const userId = req.params.user_id
    const productURL = req.params['product_url'] + req.params[0]
    await axios.get(productURL).then(async (data) => {
        const $ = cheerio.load(data.data)
        let price = $(".a-price-symbol").html() + $(".a-price-whole").first().text().slice(0, -1)
        // if(price === undefined) {
        //     await axios.get(productURL, { headers: { 'User-Agent': userAgent } }).then(data => {
        //         const $ = cheerio.load(data.data)
        //         price = $(".a-price-symbol").html() + $(".a-price-whole").first().text().slice(0, -1)
        //     })
        // } else {
        //     price = $(".a-price-symbol").html() + $(".a-price-whole").first().text().slice(0, -1)
        // }
        const urlSplit = productURL.split('/').filter(n => n)
        const index = urlSplit.indexOf('dp') + 1
        const productID = urlSplit[index]
        res.json({ productURL, price, productID })
    }).catch(err => res.json({ error: err.message }))
})

export default router;