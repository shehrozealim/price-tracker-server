import express from "express";

import UserInfoModel from '../models/userInfoSchema.js'

const router = express.Router()

router.post('/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    await UserInfoModel.findOneAndUpdate({ userInfo: { userId } }, { userInfo: { userId }, accountCreation: new Date() }, { new: true, upsert: true })
    console.log('New user created with UserID ' + userId)
})

export default router