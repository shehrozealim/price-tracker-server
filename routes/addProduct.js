import express from 'express'
import axios from 'axios'

import ProductInfoModel from '../models/productInfoSchema.js'

const router = express.Router()

router.get('/:user_id/:product_url*', async (req, res) => {
    const userId = req.params.user_id;
    const productURL = req.params['product_url'] + req.params[0]
    
    const { data } = await axios.get(`${process.env.BASE_URL}/product/${userId}/${productURL}`)
    await ProductInfoModel.findOneAndUpdate({ userInfo: { userId } }, { $push: { products: data } }, { upsert: true }).lean().then(data => {
        res.json(data)
    }).catch(err => res.json({ error: err.message }))
})

export default router