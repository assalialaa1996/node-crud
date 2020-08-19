const mongoose = require ('mongoose')
const schema = mongoose.Schema

const ProductSchema = new schema(
    {
        nom: String,
        prix: Number,
        qte: Number

    }
    )
module.exports= mongoose.model('Product',ProductSchema)