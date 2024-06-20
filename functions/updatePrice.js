import axios from 'axios'
import { AsciiTable3 } from 'ascii-table3'
import ProductInfoModel from '../models/productInfoSchema.js';
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
                const productURL = 'https:' + productData.products[i].formattedUrl
                const { data } = await axios.get(`${process.env.BASE_URL}/price/${res}/${productURL}`)
                const priceData = { date: new Date().getTime(), price: data.price }
                productData.products[i].priceHistory.push(priceData)
                const index = productData.products[i].priceHistory.length - 2
                const lastPrice = parseFloat(productData.products[i].priceHistory[index].price.substring(1).split(",").join(""))
                const currentPrice = parseFloat(data.price.substring(1).split(",").join(""))
                const priceDiff = `${data.price.substring(0,1)}${currentPrice - lastPrice}`;
                console.log(`Updating for product ${data.productID}`)
                if (lastPrice > currentPrice) {
                    SendMail(productData.products[i].productImage, data.price, productData.products[i].priceHistory[index].price, priceDiff, productData.products[i].title, data.productID, email)
                    table.addRowMatrix([
                        [data.productID, data.price, 'decreased']
                    ])
                } else if (lastPrice < currentPrice) {
                    SendMail(productData.products[i].productImage, data.price, productData.products[i].priceHistory[index].price, priceDiff, productData.products[i].title, data.productID, email)
                    table.addRowMatrix([
                        [data.productID, data.price, 'increased']
                    ]);
                } else if (lastPrice === currentPrice) {
                    table.addRowMatrix([
                        [data.productID, data.price, 'same']
                    ])
                }
            } catch (error) {
                console.log(error.message)
            }

        }
        table.setWidth(2, 15)
        await productData.save()
        console.log(table.toString())
    }))
    console.log('Updated for all users')
}