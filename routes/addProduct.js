import express from 'express'
import axios from 'axios'

import ProductInfoModel from '../models/productInfoSchema.js'
import UniqueProductsModel from '../models/UniqueProductsSchema.js'

const router = express.Router()

router.get('/:user_id/:product_url*', async (req, res) => {
    const userId = req.params.user_id;
    const productURL = req.params['product_url'] + req.params[0]
    const urlSplit = productURL.split('/').filter(n => n)
    const index = urlSplit.indexOf('dp') + 1
    const productID = urlSplit[index]
    const baseURL = req.protocol + '://' + req.get('host')
    const { data } = await axios.get(`${baseURL}/product/${userId}/${productURL}`)
    const formattedUrl = `//${urlSplit[1]}/${urlSplit[2]}/${urlSplit[3]}/${urlSplit[4]}`
    const newProduct = {
        dateAdded: new Date().getTime(),
        title: data.title,
        price: data.price,
        productImage: data.productImage,
        productId: productID,
        formattedUrl: data.formattedUrl,
        features: data.features,
        rating: data.rating,
        priceHistory: data.priceHistory,
        userIds: userId
    }
    const productData = {
        dateAdded: new Date().getTime(),
        productId: productID,
        formattedUrl: formattedUrl
    }
    await UniqueProductsModel.findOne({ productId: productID }).then(async (product) => {
        if(!product) {
            product = new UniqueProductsModel(newProduct)
            await product.save()
            console.log(`New product added: ${productID}`)
        } else {
            product.usersWatchlisted = product.usersWatchlisted + 1;
            product.userIds.push(userId)
            await product.save()
        }
    }).catch(err => console.log(err.message))
    
    await ProductInfoModel.findOneAndUpdate({ userInfo: { userId } }, { $push: { products: productData } }, { upsert: true }).lean().then(data => {
        res.json(data)
    }).catch(err => res.json({ error: err.message }))
})

export default router