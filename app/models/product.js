/**
 * Created by Imdadul Huq on 20-Aug-15.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var ProductSchema = new Schema({
    productName: {type: String, default: 'N/A'},
    url: {type: String},
    brand: {type: String},
    description: {type: String},
    price: {type: Number},
    imgUrl: {type: String},
    store: {type: Schema.ObjectId, ref: 'Store'}
});

Product = mongoose.model('Product', ProductSchema);