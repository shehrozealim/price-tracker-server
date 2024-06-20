import express from 'express'
import ProductInfoModel from '../models/productInfoSchema.js'
import UniqueProductsModel from '../models/UniqueProductsSchema.js'
const router = express.Router()

router.get('/:user_id/:product_id', async (req, res) => {
    const user_id = req.params.user_id;
    const productId = req.params.product_id;
    const addedProducts = await UniqueProductsModel.findOne({ productId }).lean()
    res.status(200).json(addedProducts)
})

export default router