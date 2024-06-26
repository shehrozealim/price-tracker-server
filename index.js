import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { config } from 'dotenv'
config()
import mongoose from 'mongoose'
import cron from 'node-cron'
import cookieParser from 'cookie-parser'

import ProductInfoRoute from './routes/productInfo.js'
import AddedProductsRoute from './routes/addedProducts.js'
import AddProductRoute from './routes/addProduct.js'
import RemoveProductRoute from './routes/removeProduct.js'
import GetPriceRoute from './routes/getPrice.js'
import AddNewUserRoute from './routes/createUser.js'
import UserInfoRoute from './routes/userInfo.js'

import { UpdatePrice } from './functions/updatePrice.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('works')
})

app.use('/create', AddNewUserRoute)
app.use('/product', ProductInfoRoute)
app.use('/info', AddedProductsRoute)
app.use('/add', AddProductRoute)
app.use('/remove', RemoveProductRoute)
app.use('/price', GetPriceRoute)
app.use('/user', UserInfoRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT || 5000, () => {
    console.log(`Server running on port ${PORT}`)
})

mongoose.connect(process.env.CONNECTION_STRING, { dbName: 'product-tracker' }).then(() => {
    console.log('Connected to MongoDB')
})

cron.schedule('0 */30 * * * *', () => {
    console.log('Price updated every 30 minutes')
})
// UpdatePrice()

export default app