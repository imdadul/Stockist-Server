/**
 * Created by Imdadul Huq on 29-Sep-15.
 */

var common = require ('../controller/common');

exports.getLatestProducts = function(req,res) {
    var query = {};
    if( req.body.currentShown !== '' && req.body.currentShown !== undefined && req.body.currentShown.length>0){
        params = req.body.currentShown.toString().split(',');
        var tempArr = [];
        for(var i = 0; i < params.length; i++){
            tempArr.push(params[i].toString());
        }
        query['_id'] = {$nin: tempArr};
    }

    /*----------------------*/
    Product.find(query)
        //.sort(options.sort)
        .limit(10)
        .populate({
            path: 'store',
            select: 'name fullName url'
        })
        .sort({
            index: 1 //Sort by Date Added DESC
        })
        .exec(function(err,result){
            if(err){
                console.log('Query Error: '+err.message);
            }
            else{
                res.send(common.setLikePropToProducts(req,result));
            }
        })
};