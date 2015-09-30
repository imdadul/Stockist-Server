/**
 * Created by Imdadul Huq on 29-Sep-15.
 */



exports.getLatestProducts = function(req,res) {
    var query = {};

    if( req.body.currentShown !== '' && req.body.currentShown !== undefined){
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
        .exec(function(err,result){
            if(err){
                console.log('Query Error: '+err.message);
            }
            else{
                res.send(result);
            }
        })
};