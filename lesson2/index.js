const cheerio = require('cheerio');
const request = require('superagent');
const Eventproxy = require('eventproxy');
const Url = require('url');
const http = require('http');

console.log('start....');
const crawler = (resc) => {
  request.get('https://cnodejs.org/')
    .end((err, res) => {
      if (err) {
        console.log(err);
      }
      const $ = cheerio.load(res.text);
      const urls = [];
      $('#topic_list .topic_title').each((idx, item) => {
        const content = $(item);
        const href = content.attr('href');
        urls.push(href);
      });

      const ep = new Eventproxy();
      ep.after('sendUrl', urls.length, (data) => {
        data.forEach((item) => {
          const href = item[0];
          const $1 = cheerio.load(item[1].text);
          const title = $1('.topic_full_title').text().trim();
          const comment = $1('.reply_content').eq(0).text().trim();

          resc.write(`title:${title}, href:${href}, comment:${comment}\n`);
        });
        resc.end();
      });
      urls.forEach((url) => {
        const requestUrl = Url.resolve('https://cnodejs.org/', url);
        request.get(requestUrl)
          .end((authorerr, authorRes) => {
            if (authorerr) {
              console.log(authorerr);
            }
            ep.emit('sendUrl', [requestUrl, authorRes]);
          });
      });
    });
};

http.createServer((req, res) => {
  req.setEncoding('utf8');
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
    crawler(res);
  }
}).listen(4000);
