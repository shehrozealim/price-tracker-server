import axios from 'axios'
import { AlignmentEnum, AsciiTable3 } from 'ascii-table3'
import ProductInfoModel from '../models/productInfoSchema.js';

export async function UpdatePrice() {
    const userIds = (await ProductInfoModel.find({}).lean()).map(res => res.userInfo.userId)
    await Promise.all(userIds.map(async (res) => {
        const productData = await ProductInfoModel.findOne({ userInfo: { userId: res } })
        var table = new AsciiTable3(res)
            .setHeading('ID', 'Price', 'Change')
        for (let i = 0; i < productData.products.length; i++) {
            try {
                const productURL = 'https:' + productData.products[i].formattedUrl
                const { data } = await axios.get(`${process.env.BASE_URL}/price/${res}/${productURL}`)
                console.log(data.price)
                const priceData = { date: new Date().getTime(), price: data.price }
                productData.products[i].priceHistory.push(priceData)
                const index = productData.products[i].priceHistory.length - 2
                const lastPrice = productData.products[i].priceHistory[index].price
                if ('47,999' > data.price) {
                    table.addRowMatrix([
                        [data.productID, data.price, 'decreased']
                    ])
                } else if (lastPrice < data.price) {
                    table.addRowMatrix([
                        [data.productID, data.price, 'increased']
                    ])
                } else if (lastPrice === data.price) {
                    table.addRowMatrix([
                        [data.productID, data.price, 'same']
                    ])
                }
            } catch (error) {
                console.log(error.message)
            }

        }
        table.setWidth(2, 15)
        // await productData.save()
        console.log(table.toString())

    }))
}