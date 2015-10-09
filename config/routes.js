/**
 * Created by Imdadul Huq on 20-Aug-15.
 */

var productCtrl = require('../app/controller/products');
var userCtrl = require('../app/controller/user');

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Credentials", "true");

        //res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/hello', function(req,res){
        res.send('Hello World!');
    });

    app.post('/getLatestProducts',userCtrl.loadUser, productCtrl.getLatestProducts);
    app.post('/addToFavorite', userCtrl.addToFavorite);
    app.post('/deleteFromFavourite', userCtrl.deleteFromFavourite);
    app.post('/onLogin', userCtrl.onLogin);
}
