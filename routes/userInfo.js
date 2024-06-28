import express from 'express'
import UserInfoModel from '../models/userInfoSchema.js'
import UniqueProductsModel from '../models/UniqueProductsSchema.js'
const router = express.Router()

router.get('/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    const data = await UserInfoModel.findOne({ userInfo: { userId } }).lean()
    const productIds = data.products.map(product => product.productId)
    const addedProducts = []
    await Promise.all(productIds.map(async (productId) => {
        await UniqueProductsModel.findOne({ productId }).lean().then(product => {
            addedProducts.push(product)
        })
    })).then(() => {
        res.status(200).json(addedProducts)
    })
    
})

router.get('/:user_id/info', async (req, res) => {
    const userId = req.params.user_id;
    const data = await UserInfoModel.findOne({ userInfo: { userId } }).lean()
    res.status(200).json(data)
})

export default router