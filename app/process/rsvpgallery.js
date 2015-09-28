/**
 * Created by Imdadul Huq on 20-Aug-15.
 */

var async =  require('async');
var request =  require('request');
var cheerio =  require('cheerio');

module.exports = {
    scrape:function(mainCallback){
        var siteUrl = 'http://rsvpgallery.com';
        var url = siteUrl+'/collections/new-arrivals';
        var numberOfPages = 3;
        var pageNumbers = [];
        for(var i =1 ;i<=numberOfPages;i++){
            pageNumbers.push(i);
        }
        var store = 'RSVP';
        var products = [];
        async.forEach(pageNumbers,function(num,loopCallback){
                var cUrl = url+'?page='+num;
                request(cUrl,function(error,response,html){
                    if(!error){
                        var $ = cheerio.load(html);
                        var children = $('#product-loop').children('div');
                        children.each(function(){
                            var product = {};
                            product.url = siteUrl+ $(this).children('.ci').children('a').attr('href');
                            product.imgUrl = $(this).children('.ci').children('a').children('img').attr('src');
                            product.brand = $(this).children('.product-details').children('a').children('h4').text();
                            product.productName = $(this).children('.product-details').children('a').children('h3').text();
                            product.price = $(this).children('.product-details').children('.price').children('.prod-price').text();
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
                            var descriptionBox = $('.rte');
                            product.description = "<div class='p1'>"+ descriptionBox.children('.p1').text() +"</div>";
                            product.description += "<div class='p2'>"+ descriptionBox.children('.p2').text() +"</div>";
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
