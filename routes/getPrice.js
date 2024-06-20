import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import UserAgent from 'user-agents'

const router = express.Router()

router.get('/:user_id/:product_url*', async (req, res) => {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString()
    const userId = req.params.user_id
    const productURL = req.params['product_url'] + req.params[0]
    const urlSplit = productURL.split('/').filter(n => n)
    const formattedUrl = `//${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}/${urlSplit[4]}`
    async function FetchPrice() {
        const { data } = await axios.get(formattedUrl, { headers: { 'User-Agent': userAgent } })
        const $ = cheerio.load(data)
        const urlSplit = productURL.split('/').filter(n => n)
        const index = urlSplit.indexOf('dp') + 1
        const productID = urlSplit[index]
        let price
        if (productID.startsWith('B')) {
            price = $(".a-price-symbol").html() + $(".a-price-whole").first().text().slice(0, -1)
        } else {
            price = $("#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2)").text()
        }

        res.json({ productURL, price, productID })
    }
    new Promise(async (resolve, reject) => {
        try {
            await FetchPrice()
            resolve
        } catch (error) {
            await FetchPrice()
            reject
        }

    }).catch(async () => {
        FetchPrice()

    })
})

export default router;