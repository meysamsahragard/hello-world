const request = require('request');
var express = require("express");
var json2xls = require('json2xls');
const fs = require('fs');
var app = express();
const url = 'https://metawave.ir/makejson.php?&panel_amar_tedadhaghighi=0&panel_amar_tedadhoghooghi=0&panel_amar_hajmhaghighi=0&panel_amar_hajmhoghooghi=0&panel_amar_hajmhaghighihoghooghi=0&panel_amar_kharidhaghighi1=0&panel_amar_kharidhaghighi2=&panel_amar_forooshhaghighi1=0&panel_amar_forooshhaghighi2=&panel_amar_kharidhoghooghi1=0&panel_amar_kharidhoghooghi2=&panel_amar_forooshhoghooghi1=0&panel_amar_forooshhoghooghi2=&panel_amar_saf=0&panel_amar_faselehgheimat=0&panel_amar_hajmhaghighibekol=0&panel_amar_ghodrat_haghighi=0&panel_amar_hajmhoghooghibekol=0&panel_amar_hajmhaghighibekol_sell=0&panel_amar_hajmhoghooghibekol_sell=0&panel_amar_hajmkol=1&panel_amar_hajmkol_val=0&panel_amar_khordeforooshi=0&panel_bazarpaie=0&_=1584639647510';
const options = {
  url: url,
  headers: {
    Cookie: "PHPSESSID=tuoj8nc1emi64f4g82vivs2u97; _ga=GA1.2.2144405978.1584188776; ssupp.vid=XCqW4tH2V; ssupp.chatid=null; ssupp.visits=3; _gid=GA1.2.1911236001.1584639579"
  }
};

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.get("/url", (req, res, next) => {
  try {
    request(options, function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      if (!body.includes("script")) {
        let asJson = JSON.parse(body);
        let data = asJson.data;
        data.forEach((element, index) => {
          data[index].namad = /<a [^>]+>(.*?)<\/a>/g.exec(element.namad)[1];
          data[index].paiani = data[index].paiani.replace(/<img .*?>/g, "");
          delete data[index].groupmap;
          delete data[index].cashflow;

        });
        let xls = json2xls(asJson.data);
        fs.writeFileSync(Date.now() + 'data.xlsx', xls, 'binary');
      res.send(body);

      }else{
      res.send('isNotLogin');
      }


    });
  } catch (err) {
    res.send(err);
  }
});