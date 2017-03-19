const cheerio = require('cheerio');
const request = require('superagent');
const http = require('http');

console.log('start....');
const crawler = (resc) => {
  request.get('https://cnodejs.org/')
    .end((err, res) => {
      if (err) {
        console.log(err);
      }
      const $ = cheerio.load(res.text);
      $('#topic_list .topic_title').each((idx, item) => {
        const content = $(item);
        resc.write(`title:${content.attr('title')}, href:${content.attr('href')}\n`);
      });
      resc.end();
    });
};

http.createServer((req, res) => {
  req.setEncoding('utf8');
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
    crawler(res);
  }
}).listen(4000);
