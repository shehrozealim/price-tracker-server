import express from 'express'
import ProductInfoModel from '../models/productInfoSchema.js'

const router = express.Router()

router.get('/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    const data = await ProductInfoModel.findOne({ userInfo: { userId } }).lean()
    res.status(200).json(data)
})

export default router