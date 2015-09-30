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
        var numberOfPages = 5; // In reality there are 19 pages, we will take only 5 pages of it.
        var pageNumbers = [];
        for(var i =1 ;i<=numberOfPages;i++){
            pageNumbers.push(i);
        }
        var products = [];
        var brands = [];

        var getBrandName = function(str){
            for(var i=0;i<brands.length;i++){
                var patt = new RegExp(brands[i]);
                var isMatched = patt.test(str);
                if(isMatched){
                    return brands[i];
                }
            }
        };
        async.eachSeries(pageNumbers,function(num,loopCallback){
                var cUrl = url+'?p='+num;
                request(cUrl,function(error,response,html){
                    if(!error){
                        var $ = cheerio.load(html);
                        var children = $('.thumbnail');
                        if(brands.length==0){
                            var branNameElm = $('#fme_layered_brand ol li').children('a');
                            branNameElm.each(function(){
                                brands.push($(this).text());
                            })
                        }
                        children.each(function(){
                            var product = {};
                            product.url = $(this).children('a').attr('href');
                            product.imgUrl = $(this).children('a').children('img').attr('src');
                            var name = $(this).children('a').attr('title');
                            product.brand = getBrandName(name);
                            product.productName = name.replace(product.brand,"");
                            product.price = $(this).children('.price-box').children('.regular-price').children('.price').text();
                            product.price=product.price.replace(",",'');
                            product.price=product.price.replace("$",'');
                            product.price = parseFloat(product.price);
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
