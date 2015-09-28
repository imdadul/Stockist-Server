/**
 * Created by Imdadul Huq on 27-Sep-15.
 */
var async =  require('async');
var request =  require('request');
var cheerio =  require('cheerio');

module.exports = {
    scrape:function(mainCallback){
        var store = 'END';
        var siteUrl = 'http://www.endclothing.com';
        var url = siteUrl+'/us/latest-products/new-this-week';
        var numberOfPages = 19;
        var pageNumbers = [];
        for(var i =1 ;i<=numberOfPages;i++){
            pageNumbers.push(i);
        }
        var products = [];
        async.eachLimit(pageNumbers,1,function(num,loopCallback){
                var cUrl = url+'?p='+num;
                request(cUrl,function(error,response,html){
                    if(!error){
                        var $ = cheerio.load(html);
                        var children = $('.thumbnail');
                        children.each(function(){
                            var product = {};
                            product.url = $(this).children('a').attr('href');
                            product.imgUrl = $(this).children('a').children('img').attr('src');
                            //product.brand = $(this).children('.product-details').children('a').children('h4').text();
                            product.productName = $(this).children('a').attr('title');
                            product.price = $(this).children('.price-box').children('.regular-price').children('.price').text();
                            product.price = parseFloat(product.price.replace("$",''));
                            product.store = store;
                            products.push(product);
                        });
                        //if(children.length==0) mainCallback(products);
                        //else loopCallback();
                        loopCallback();
                    }
                    else {
                        var missedPageNumber = this.path.slice(this.path.indexOf('=')+1, this.path.length);
                        pageNumbers.push(missedPageNumber);
                        loopCallback();
                    }
                });
            },
            function(err){
                var count = 0 ;
                async.eachLimit(products,5,function(product,cb){
                    request(product.url,function(error,response,html){
                        if(!error){
                            var $ = cheerio.load(html);
                            var descriptionBox = $('.std');
                            product.description = descriptionBox.html();
                            cb();
                        }
                        else {
                            count++;
                            cb();
                        }
                    })
                },function(err){
                    console.log('Scrap finished for ' + store);
                    mainCallback(products);
                })

            }
        );

    }
}
