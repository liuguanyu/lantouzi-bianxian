var cli = require("commander");
var request = require("request");
var cheerio = require("cheerio");
var sendmail = require("sendmail")();

var urlTmp = "https://lantouzi.com/bianxianjihua/index?page=%d&size=14&tag=2";
var arr = [1,2,3,4,5,6];
var REQUEST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:13.0) Gecko/20100101 Firefox/13.0',
};

cli.allowUnknownOption()
   .version( require("./package.json").version )
   .option("-d, --day [value]", "max date")
   .option("-p, --profit [value]", "min profit")
   .option("-m, --mail [value]", "mailto")
   .parse( process.argv );

var minProfit = typeof cli.profit !== undefined && parseFloat(cli.profit) ? parseFloat(cli.profit) : 8.00;
var maxDays = typeof cli.day !== undefined && parseInt(cli.day, 10) ? parseInt(cli.day, 10) : 100;

var mailto = typeof cli.mail == undefined ? undefined : cli.mail;

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
            var leave = $(this).find(".info-three em").text();

            return parseFloat(profit) >= minProfit && parseInt(days, 10) <= maxDays && parseFloat(leave) > 0.00; 
        });

        lists = lists.map(function (){
            return [$(this).find(".info-one em").html(),  $(this).find(".info-two em").html() + "天",  "剩余"+$(this).find(".info-three em").text(),  $(this).find(".info-four a").attr("href")].join('\t');  
        }).toArray();

        return prev.concat(lists);
    }, []);

    if (data.length >0 && mailto) {
        sendmail({
            from: 'no-reply@yourdomain.com',
            to: mailto,
            subject: '最新的高收益变现',
            content: data.join("\n")
        }, function(err, reply) {
            // console.log(err && err.stack);
            // console.dir(reply);
        });
    }
    console.log(data.join("\n"));
});
