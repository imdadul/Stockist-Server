/**
 * Created by Imdadul Huq on 29-Sep-15.
 */



exports.addToFavorite = function(req,res) {
    req.session.userID = req.body.oauthID;
    User.findOneAndUpdate(
        {openAuthID:req.body.oauthID},
        {$push: {"favourites": req.body.productUrl}},
        {upsert:true},
        function(err, model) {
            if(err) console.log(err);
            else {
                req.session.likes.push(req.body.productUrl);
                res.send(true);
            }
        }
    );
};

exports.deleteFromFavourite = function(req,res) {
    req.session.userID = req.body.oauthID;
    User.findOneAndUpdate(
        {openAuthID:req.body.oauthID},
        {$pull: {"favourites": req.body.productUrl}},
        {upsert:true},
        function(err, model) {
            if(err) console.log(err);
            else {
                for(var i=0;i<req.session.likes.length;i++){
                    if(req.session.likes[i]==req.body.productUrl){
                        req.session.likes.splice(i,1);
                    }
                }
                res.send(true);
            }
        }
    );
};

exports.onLogin = function(req,res) {
    req.session.userID = req.body.oauthID;
    User.findOne({openAuthID:req.session.userID},'-oauthID',function(err, user) {
            if(user && user.favourites){
                user.favourites.forEach(function(i){
                    req.session.likes =[];
                    req.session.likes.push(i);
                })
            }
            req.session.hasUserLoadedOnce = true;
            res.send(user);
        }
    );
};

exports.loadUser = function(req,res,next){
    if(req.session.hasUserLoadedOnce != true || (req.session.hasUserLoadedOnce == true && req.session.userID != req.body.oauthID) ){
        req.session.userID = req.body.oauthID;
        User.findOne({openAuthID:req.session.userID},'-oauthID',function(err, user) {
                req.session.likes =[];
                if(user && user.favourites){
                    user.favourites.forEach(function(i){
                        req.session.likes.push(i);
                    })
                }
                req.session.hasUserLoadedOnce = true;
                next();
            }
        );
    }
    else {
        next();
    }
}