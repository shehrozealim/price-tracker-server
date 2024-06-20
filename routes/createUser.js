import express from "express";

import ProductInfoModel from '../models/productInfoSchema.js'

const router = express.Router()

router.post('/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    await ProductInfoModel.findOneAndUpdate({ userInfo: { userId } }, { userInfo: { userId }, accountCreation: new Date() }, { new: true, upsert: true })
    console.log('New user created with UserID ' + userId)
})

export default router