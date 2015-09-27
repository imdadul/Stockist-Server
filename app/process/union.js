/**
 * Created by Imdadul Huq on 27-Sep-15.
 */

var async =  require('async');
var request =  require('request');
var cheerio =  require('cheerio');

module.exports = {
    scrape:function(mainCallback){
        var url = 'http://store.unionlosangeles.com/collections/new-releases';
        var store = 'UNION';
        var products = [];
        request(url,function(error,response,html){
            if(!error){
                var $ = cheerio.load(html);
                var children = $('#product-loop').children('div');
                children.each(function(){
                    var product = {};
                    product.url = $(this).children('.ci').children('a').attr('href');
                    product.imgUrl = $(this).children('.ci').children('a').children('img').attr('src');
                    product.brand = $(this).children('.product-details').children('a').children('h4').text();
                    product.productName = $(this).children('.product-details').children('a').children('h4').text();
                    product.price = $(this).children('.product-details').children('.price').children('.prod-price').text();
                    product.price = parseFloat(product.price.replace("$",''));
                    product.store = store;
                    products.push(product);
                });
                mainCallback(products);
            }
        });
    }
}
