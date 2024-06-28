import express from 'express'

import UserInfoModel from '../models/userInfoSchema.js'
import UniqueProductModel from '../models/UniqueProductsSchema.js'
const router = express.Router()

router.get('/:user_id/:product_id', async (req, res) => {
    const userId = req.params.user_id
    const productId = req.params.product_id

    await UserInfoModel.findOneAndUpdate({ userInfo: { userId } }, { $pull : { products: { productId } } }).lean().then(data => {
        res.status(200).json(data)
    }).catch(err => res.json({ error: err.message }))

    await UniqueProductModel.findOne({ productId }).then(async (data) => {
        data.usersWatchlisted -= 1
        await data.save()
    })
})

export default router