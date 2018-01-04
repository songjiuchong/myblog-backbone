module.exports = function (app) {
  
  var PostModel = require('../models/posts')

  app.get('/userKeyInfo',function(req, res, next){
    req.ifAjax = true;
    reqJson = {};

    // 添加模板必需的三个变量;
    reqJson.user = res.locals.user;
    reqJson.success = res.locals.success;
    reqJson.error = res.locals.error;

    res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
    res.write(JSON.stringify(reqJson));
    res.end();
    next();
  })

  app.get('/getPosts', function (req, res, next) {
    const author = req.query.author

    PostModel.getPosts(author)
      .then(function (posts) {
        req.ifAjax = true;
        reqJson = {};
        reqJson.posts = posts;
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
        res.write(JSON.stringify(reqJson));
        res.end();
      })
      .catch(next)
  })

  app.use(function (req, res, next) {
      if(!req.ifAjax){
        var clientui = require('fs').readFileSync('views/myblogIni.html');
        //cors settings;   
        var origin = (req.headers.origin || "*");  
        res.setHeader('Access-Control-Allow-Credentials', true); 
        res.setHeader('Access-Control-Allow-Origin', origin);     
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers','accept, content-type');
        
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8;'}); //注意, 如果这里不添加charset=utf-8响应, 页面会显示中文乱码;
        res.write(clientui);
        res.end();
        // res.writeHead(404);
        // res.end();
      }
      next();
  })
}
