/**
 * Created by Imdadul Huq on 20-Aug-15.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var StoreSchema = new Schema({
    name: {type: String},
    fullName: {type: String},
    url: {type: String,required: true, default: ''},
    logoUrl: {type: Number}
});

Store = mongoose.model('Store', StoreSchema);