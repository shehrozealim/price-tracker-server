import express from 'express'
import ProductInfoModel from '../models/productInfoSchema.js'

const router = express.Router()

router.get('/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const addedProducts = await ProductInfoModel.findOne({ userInfo: { userId: user_id } }).lean()
    res.status(200).json(addedProducts)
})

export default router