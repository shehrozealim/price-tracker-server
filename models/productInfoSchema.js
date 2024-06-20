import mongoose from 'mongoose'

const ProductInfoSchema = new mongoose.Schema({
    userInfo: {
        userId: { type: String },
    },
    emailId: { type: String, default: '' },
    products: [{
        dateAdded: Date,
        productId: String,
        formattedUrl : String,
    }],
    accountCreation: Date,
    premium: { type: Boolean, default: false }
}, { versionKey: false })

export default mongoose.model('ProductInfoModel', ProductInfoSchema)