import axios from 'axios'
import { AsciiTable3 } from 'ascii-table3'

import ProductInfoModel from '../models/productInfoSchema.js';
import UniqueProductsModel from '../models/UniqueProductsSchema.js';
import { SendMail } from './sendMail.js';

export async function UpdatePrice() {
    var table = new AsciiTable3('PRODUCT INFO')
    const productIDs = (await UniqueProductsModel.find({}).lean()).map(res => res.productId)
    await Promise.all(productIDs.map(async (res) => {
        table.setHeading('ID', 'Price', 'Change', 'Price Diff')
        const userIds = (await UniqueProductsModel.findOne({ productId: res })).userIds
        const productData = await UniqueProductsModel.findOne({ productId: res })
        const productURL = 'https' + productData.formattedUrl
        const { data } = await axios.get(`${process.env.BASE_URL}/price/${res}/${productURL}`)
        const priceData = { date: new Date().getTime(), price: data.price }
        productData.priceHistory.push(priceData)
        console.log(`Updating price for product ID: ${res}`)
        const index = productData.priceHistory.length - 2
        const lastPrice = parseFloat(productData.priceHistory[index].price.substring(1).split(",").join(""))
        const currentPrice = parseFloat(data.price.substring(1).split(",").join(""))
        const priceDiff = `${data.price.substring(0, 1)}${currentPrice - lastPrice}`;
        if (lastPrice > currentPrice) {
            userIds.map(async (userId) => {
                const email = (await ProductInfoModel.findOne({ userInfo: { userId } })).emailId
                if (!email) return;
                SendMail(productData.productImage, data.price, productData.priceHistory[index].price, priceDiff, productData.title, data.productID, email)
            })
            table.addRowMatrix([
                [data.productID, data.price, 'decreased', priceDiff]
            ])
        } else if (lastPrice < currentPrice) {
            userIds.map(async (userId) => {
                const email = (await ProductInfoModel.findOne({ userInfo: { userId } })).emailId
                if (!email) return;
                SendMail(productData.productImage, data.price, productData.priceHistory[index].price, priceDiff, productData.title, data.productID, email)
            })
            table.addRowMatrix([
                [data.productID, data.price, 'decreased', priceDiff]
            ])
        } else if (currentPrice === lastPrice) {
            table.addRowMatrix([
                [data.productID, data.price, 'same', priceDiff]
            ])
        }
        await productData.save()
    }))
    console.log(table.toString())
}