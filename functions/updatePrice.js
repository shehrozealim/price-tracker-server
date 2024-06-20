import axios from 'axios'
import { AsciiTable3 } from 'ascii-table3'

import ProductInfoModel from '../models/productInfoSchema.js';
import UniqueProductsModel from '../models/UniqueProductsSchema.js';
import { SendMail } from './sendMail.js';

export async function UpdatePrice() {
    const userIds = (await ProductInfoModel.find({}).lean()).map(res => res.userInfo.userId)
    await Promise.all(userIds.map(async (res) => {
        const productData = await ProductInfoModel.findOne({ userInfo: { userId: res } })
        
        console.log(`Updating for user ${res}`)
        var table = new AsciiTable3(res)
        .setHeading('ID', 'Price', 'Change')
        for (let i = 0; i < productData.products.length; i++) {
            try {
                const email = productData.emailId
                const productURL = 'https' + productData.products[i].formattedUrl
                const { data } = await axios.get(`${process.env.BASE_URL}/price/${res}/${productURL}`)
                const product = await UniqueProductsModel.findOne({ productId: data.productID })
                const priceData = { date: new Date().getTime(), price: data.price }
                product.priceHistory.push(priceData)
                const index = product.priceHistory.length - 2
                const lastPrice = parseFloat(product.priceHistory[index].price.substring(1).split(",").join(""))
                const currentPrice = parseFloat(data.price.substring(1).split(",").join(""))
                const priceDiff = `${data.price.substring(0,1)}${currentPrice - lastPrice}`;
                console.log(`Updating for product ${data.productID}`)
                await product.save()
                if (lastPrice > currentPrice) {
                    SendMail(product.productImage, data.price, product.priceHistory[index].price, priceDiff, product.title, data.productID, email)
                    table.addRowMatrix([
                        [data.productID, data.price, 'decreased']
                    ])
                } else if (lastPrice < currentPrice) {
                    SendMail(product.productImage, data.price, product.priceHistory[index].price, priceDiff, product.title, data.productID, email)
                    table.addRowMatrix([
                        [data.productID, data.price, 'increased']
                    ]);
                } else if (lastPrice === currentPrice) {
                    table.addRowMatrix([
                        [data.productID, data.price, 'same']
                    ])
                }
            } catch (error) {
                console.log(`Error occured on update price ${error}`)
            }

        }
        table.setWidth(2, 15)
        await productData.save()
        console.log(table.toString())
    }))
    console.log('Updated for all users')
}