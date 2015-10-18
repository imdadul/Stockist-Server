/**
 * Created by Imdadul Hu on 09-Oct-15.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var UserSchema = new Schema({
    name: {type: String},
    created: {type: Date,required: true, default: Date.now()},
    oauthID: {type: Number },
    provider:{type:String,default:'manual'},
    followingStores: [{type: Schema.ObjectId, ref: 'Store'}],
    favourites:[{type: String}]
});

User = mongoose.model('User', UserSchema);