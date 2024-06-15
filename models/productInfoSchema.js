import mongoose from 'mongoose'

const ProductInfoSchema = new mongoose.Schema({
    userInfo: {
        userId: { type: String },
    },
    products: [{
        dateAdded: Date,
        title: String,
        productId: String,
        price: String,
        productImage: String,
        formattedUrl : String,
        features: { type: Array, default: [] },
        rating: String,
        priceHistory: { type: Array, default: [] }
    }],
    accountCreation: Date,
    premium: { type: Boolean, default: false }
}, { versionKey: false })

export default mongoose.model('ProductInfoModel', ProductInfoSchema)