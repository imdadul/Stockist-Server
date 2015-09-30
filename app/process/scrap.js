/**
 * Created by Imdadul Huq on 20-Aug-15.
 */

var async = require('async')

var rsvp = require('./rsvpgallery');
var end = require('./end');
var bodega = require('./bodega');
var ism = require('./ism');
var tresbien = require('./tresbien');
var union = require('./union');

var sites = [
    {
        name:'RSVP',
        object:rsvp
    },
    //{
    //    name:'END',
    //    object:end
    //}
    //{
    //    name:'BODEGA',
    //    object:bodega
    //},
    //{
    //    name:'TRESBIEN',
    //    object:tresbien
    //},
    //{
    //    name:'UNION',
    //    object:union
    //},
    //{
    //    name:'ISM',
    //    object:ism
    //},
]

var stores=[];

Store.find({},function(err,items){ // Gets all the store details can be used later.
    items.forEach(function(s){
        stores.push(s);
    })
})

var getStoreBy = function(name){
    for(var i = 0;i<stores.length;i++){
        if(stores[i].name == name){
            return stores[i];
        }
    }
}

async.eachSeries(sites,function(site,callback){
    site.object.scrape(function(products){
        try{
            if(products[0].store)
                var store = getStoreBy(products[0].store);
            Product.remove({store:store.id},function(err){
                async.eachSeries(products,function(p,cb){
                    product =  new Product(p);
                    delete product.store;
                    product.store = store.id;
                    product.save(function (err) {
                        cb();
                    })
                },function(err){
                    callback();
                });
            })
        }
        catch(exp){
            errorLog += exp + ' in '+ site.name;
            callback();
        }

    });
},function(err){

    console.log(err);
    //var fs = require('fs');
    fs.appendFile("./errorlog.txt", errorLog, function(err) {
        if(err) {
            return console.log(err);
        }
    });
    console.log("Done updating");

});