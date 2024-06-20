import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { config } from 'dotenv'
config()
import mongoose from 'mongoose'
import cron from 'node-cron'

import ProductInfoRoute from './routes/productInfo.js'
import AddedProductsRoute from './routes/addedProducts.js'
import AddProductRoute from './routes/addProduct.js'
import RemoveProductRoute from './routes/removeProduct.js'
import GetPriceRoute from './routes/getPrice.js'
import AddNewUserRoute from './routes/createUser.js'
import UserInfoRoute from './routes/userInfo.js'

import ProductInfoModel from './models/productInfoSchema.js'

import { UpdatePrice } from './functions/updatePrice.js'
import { SendMail } from './functions/sendMail.js'

const app = express()

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('works')
})

app.use('/product', ProductInfoRoute)
app.use('/info', AddedProductsRoute)
app.use('/add', AddProductRoute)
app.use('/remove', RemoveProductRoute)
app.use('/price', GetPriceRoute)
app.use('/create', AddNewUserRoute)
app.use('/user', UserInfoRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

mongoose.connect(process.env.CONNECTION_STRING, { dbName: 'product-tracker' }).then(() => {
    console.log('Connected to MongoDB')
})


UpdatePrice()