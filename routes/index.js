module.exports = function (app) {
  
  var PostModel = require('../models/posts')
  var UserModel = require('../models/users')
  const sha1 = require('sha1')

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
    req.ifAjax = true;

    PostModel.getPosts(author)
      .then(function (posts) {
        reqJson = {};
        reqJson.posts = posts;
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
        res.write(JSON.stringify(reqJson));
        res.end();
      })
      .catch(next)
  })

  app.post('/validateSignin', function (req, res, next) {
      const name = req.fields.name
      const password = req.fields.password
      req.ifAjax = true;

      UserModel.getUserByName(name)
      .then(function (user) {
        if (!user) {
          req.flash('error', '用户不存在')
          reqJson = {error:'用户不存在'};
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          return; //这里必须return, 不然会继续执行之后的内容从而报错: TypeError: Cannot read property 'password' of null;
        }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误')
          reqJson = {error:'用户名或密码错误'};
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          return;
        }
        req.flash('success', '登录成功')
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        reqJson = {success:'登录成功', user:user};
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
