/**
 * Created by Imdadul Huq on 09-Oct-15.
 */


exports.setLikePropToProducts = function(req,products){
    req.session.likes.forEach(function (likedProduct) {
        for(var i=0;i<products.length;i++){
            if(likedProduct==products[i].url){
                products[i]._doc.liked = true;
            }
        }
    })
    return products;
}