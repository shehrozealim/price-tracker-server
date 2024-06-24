import mongoose from 'mongoose'

const ProductsSchema = mongoose.Schema({
    dateAdded: Date,
    title: String,
    productId: String,
    price: String,
    productImage: String,
    formattedUrl: String,
    features: { type: Array, default: [] },
    rating: String,
    priceHistory: { type: Array, default: [] },
    usersWatchlisted: { type: Number, default: 1 },
    userIds : { type: Array, default: [] }
})

export default mongoose.model('UniqueProductsModel', ProductsSchema)