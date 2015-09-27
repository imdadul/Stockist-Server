/**
 * Created by Imdadul Huq on 20-Aug-15.
 */

module.exports = function (app) {
    app.get('/hello', function(req,res){
        res.send('Hello World!');
    });
}
