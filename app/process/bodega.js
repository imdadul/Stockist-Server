/**
 * Created by Imdadul Huq on 27-Sep-15.
 */
var url = 'http://shop.bdgastore.com/collections/new-arrivals';

var async =  require('async');
var request =  require('request');
var cheerio =  require('cheerio');

module.exports = {
    scrape:function(mainCallback){
        var store = 'BODEGA';
        var siteUrl = 'http://shop.bdgastore.com';
        var url = siteUrl+'/collections/new-arrivals';
        //var url = siteUrl+'/collections/new-arrivals?page=6&view=scroll&view=scroll';
        var numberOfPages = 5; // In reality there are 19 pages, we will take only 5 pages of it.
        var pageNumbers = [];
        for(var i =1 ;i<=numberOfPages;i++){
            pageNumbers.push(i);
        }
        var products = [];
        async.eachSeries(pageNumbers,function(num,loopCallback){
                var cUrl = url+'?page='+num+"&view=scroll&view=scroll";
                //http://shop.bdgastore.com/collections/new-arrivals?page=6&view=scroll&view=scroll
                request(cUrl,function(error,response,html){
                    if(!error){
                        var $ = cheerio.load(html);
                        var children = $('#page-'+num).children('li');
                        children.each(function(){
                            var product = {};
                            product.url = siteUrl+ $(this).children('.prod-image-wrap').children('.qvwrap').children('.a').attr('href');
                            product.imgUrl = $(this).children('.prod-image-wrap').children('a').children('img').attr('src');
                            product.brand = $(this).children('.prod-caption').children('h4').children('a').text();
                            product.productName =  $(this).children('.prod-caption').children('h3').children('a').text().trim();
                            product.price = $(this).children('.prod-caption').children('.prod-price').children('.money').text();
                            product.price = product.price.trim();
                            //product.price=product.price.replace(",",'');
                            //product.price=product.price.replace("$",'');
                            //product.price = parseFloat(product.price);
                            product.store = store;
                            products.push(product);
                        });
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
                            var descriptionBox = $('#product-description');
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
