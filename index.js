var request = require("request");
var cheerio = require("cheerio");

var urlTmp = "https://lantouzi.com/bianxianjihua/index?page=%d&size=14&tag=2";
var arr = [1,2,3,4,5,6];
var REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:13.0) Gecko/20100101 Firefox/13.0',
};

var minProfit = 8.00;
var maxDays = 100;

var pros = arr.map(function (el){
    var url = urlTmp.replace(/%d/, el);

    return new Promise(function (resolve, reject){
        request({
            url : url,
            header: REQUEST_HEADERS
        },  function(err, httpResponse, body) {
            if (err){
                reject(err);
            } 

            resolve(body);
        });
    }); 
});

Promise.all(pros).then(function(data){
    data = data.reduce(function (prev, current){
        var $ = cheerio.load(current, { decodeEntities: false });

        var lists = $(".project-list li").filter(function (){
            var profit = $(this).find(".info-one em").html().replace('%', '');
            var days = $(this).find(".info-two em").html();

            return parseFloat(profit) >= minProfit && parseInt(days, 10) <= maxDays 
        });

        lists = lists.map(function (){
            return [$(this).find(".info-one em").html(),  $(this).find(".info-two em").html() + "天",  "剩余"+$(this).find(".info-three em").html(),  $(this).find(".info-four a").attr("href")].join('\t');  
        }).toArray();

        return prev.concat(lists);
    }, []);

    console.log(data.join("\n"));
});
