/**
 * Created by Imdadul Huq on 20-Aug-15.
 */

var productCtrl = require('../app/controller/products');

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('/hello', function(req,res){
        res.send('Hello World!');
    });

    app.post('/getLatestProducts', productCtrl.getLatestProducts);
}
