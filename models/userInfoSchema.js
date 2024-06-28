import mongoose from 'mongoose'

const UserInfoSchema = new mongoose.Schema({
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
    userCredentials : {
        firstName: String,
        lastName: String,
        password: String,
        username: String,
        refreshToken: String
    },
    premium: { type: Boolean, default: false }
}, { versionKey: false })

export default mongoose.model('UserInfoModel', UserInfoSchema)