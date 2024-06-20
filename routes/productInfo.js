import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'
import UserAgent from 'user-agents'

const router = express.Router()

router.get('/:user_id/:product_url*', async (req, res) => {
    const productURL = req.params[0];
    const urlSplit = productURL.split('/').filter(n => n)
    const formattedUrl = `//${urlSplit[0]}/${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}`
    
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString()
    if(!formattedUrl.includes('/dp/')) return res.json({ error: 'invalid URL' });
    await axios.get(formattedUrl, { headers: { 'User-Agent': userAgent } }).then(async (data) => {
        const $ = cheerio.load(data.data)
        const index = urlSplit.indexOf('dp') + 1
        const productId = urlSplit[index]
        let price
        if(productId.startsWith('B')) {
            price = $(".a-price-symbol").html() + $(".a-price-whole").first().text().slice(0, -1)
        } else {
            price = $("#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay > span:nth-child(2)").text()
        }
        const title = $("#productTitle").text().trim()
        const productImage = $(".imgTagWrapper").find('img').attr('src')
        
        const features = []
        $("#feature-bullets > ul > li").each((i, el) => {
            const $div = $(el).find('span').text().trim()
            features.push($div)
        })
        const dateAdded = new Date().getTime()
        const priceHistory = [{
            date: dateAdded,
            price: price
        }]
        const rating = $("#averageCustomerReviews > span:nth-child(1) > span > span > a").find('span').html().trim()
        const productData = { title, price, productImage, features, rating, formattedUrl, productId, dateAdded, priceHistory }
        res.status(200).send(productData)
        
    }).catch(err => console.log(err))
})

export default router