/**
 * Created by Imdadul Hu on 09-Oct-15.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var UserSchema = new Schema({
    openAuthID: {type: String},
    followingStores: [{type: Schema.ObjectId, ref: 'Store'}],
    favourites:[{type: String}]
});

User = mongoose.model('User', UserSchema);