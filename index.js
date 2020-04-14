const request = require('request');
const express = require('express')
var cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 5000
var json2xls = require('json2xls');
const fs = require('fs');
const url = 'https://metawave.ir/makejson.php?&panel_amar_tedadhaghighi=0&panel_amar_tedadhoghooghi=0&panel_amar_hajmhaghighi=0&panel_amar_hajmhoghooghi=0&panel_amar_hajmhaghighihoghooghi=0&panel_amar_kharidhaghighi1=0&panel_amar_kharidhaghighi2=&panel_amar_forooshhaghighi1=0&panel_amar_forooshhaghighi2=&panel_amar_kharidhoghooghi1=0&panel_amar_kharidhoghooghi2=&panel_amar_forooshhoghooghi1=0&panel_amar_forooshhoghooghi2=&panel_amar_saf=0&panel_amar_faselehgheimat=0&panel_amar_hajmhaghighibekol=0&panel_amar_ghodrat_haghighi=0&panel_amar_hajmhoghooghibekol=0&panel_amar_hajmhaghighibekol_sell=0&panel_amar_hajmhoghooghibekol_sell=0&panel_amar_hajmkol=1&panel_amar_hajmkol_val=0&panel_amar_khordeforooshi=0&panel_bazarpaie=0&_=1584639647510';
const options = {
  url: url,
  headers: {
    Cookie: "PHPSESSID=8k6rmotk9en58n8med5fp361l5; _ga=GA1.2.1328222899.1586880202; _gid=GA1.2.119358716.1586880202"
  }
};
Cookie: "PHPSESSID=tuoj8nc1emi64f4g82vivs2u97; _ga=GA1.2.2144405978.1584188776; ssupp.vid=XCqW4tH2V; ssupp.chatid=null; ssupp.visits=3; _gid=GA1.2.1911236001.1584639579"
express()
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/',(req, res)=> res.sendFile('views/index.html', {root: __dirname }))
  .get('/excelapi', (req, res) => {
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
          let fileName = Date.now() + 'data.xlsx';
          fs.writeFileSync(fileName, xls, 'binary');
          // res.send(body);
          setTimeout(() => {
            fs.unlinkSync(path.join(__dirname, fileName))
          }, 10000);
          res.sendFile(path.join(__dirname, fileName));
        } else {
          res.send('isNotLogin');
        }


      });
    } catch (err) {
      res.send(err);
    }

  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
