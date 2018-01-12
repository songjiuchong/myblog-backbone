module.exports = function (app) {

  process.setMaxListeners(0);

  var PostModel = require('../models/posts')
  var UserModel = require('../models/users')
  var CommentsModel = require('../models/comments')
  const fs = require('fs')
  const path = require('path')
  const sha1 = require('sha1')


  //Ajax calls;
  
  //获取登录用户的信息;
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
  
  //获取某篇文章;
  app.get('/getPost', function (req, res, next) {
    const postId = req.query.postId;
    req.ifAjax = true;

    PostModel.getPostById(postId)
      .then(function (post) {
        reqJson = {};
        reqJson.post = post;
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
        res.write(JSON.stringify(reqJson));
        res.end();
        next();
      })
      .catch(next)
  })

  //发表一篇文章;
  app.post('/createPost', function (req, res, next) {
    req.ifAjax = true;
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content
    var reqJson = {};
    // 校验参数
    try {
      if (!title.length) {
        throw new Error('请填写标题')
      }
      if (!content.length) {
        throw new Error('请填写内容')
      }
    } catch (e) {
          req.flash('error', e.message);
          reqJson = {error:e.message};
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          return;
    }

    let post = {
      author: author,
      title: title,
      content: content,
      pv: 0
    }

    PostModel.create(post)
      .then(function (result) {
        // 此 post 是插入 mongodb 后的值，包含 _id
        post = result.ops[0]
        req.flash('success', '发表成功')
        reqJson = {success:'发表成功'};
        reqJson.post = post;
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
        res.write(JSON.stringify(reqJson));
        res.end();
        next();
      })
      .catch(next)
})
  
  //删除一篇文章;
  app.get('/removePost', function (req, res, next) {
    req.ifAjax = true;
    const postId = req.query.postId
    const author = req.session.user._id

    PostModel.getRawPostById(postId)
      .then(function (post) {
      try {
          if (!post) {
            throw new Error('文章不存在')
          }
          if (post.author._id.toString() !== author.toString()) {
            throw new Error('没有权限')
          }
      } catch (e) {
          req.flash('error', e.message);
          reqJson = {error:e.message};
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          return;
      }
        PostModel.delPostById(postId)
          .then(function () {
            req.flash('success', '删除文章成功')
            reqJson = {success:'删除文章成功'};
            reqJson.author = author;
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
            res.write(JSON.stringify(reqJson));
            res.end();
            next();
          })
          .catch(next)
      }).catch(next)
  })
  
  //获取某篇文章的所有评论;
  app.get('/getComments', function (req, res, next) {
    const postId = req.query.postId;
    req.ifAjax = true;

    CommentsModel.getComments(postId)
      .then(function (comments) {
        reqJson = {};
        reqJson.comments = comments;
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
        res.write(JSON.stringify(reqJson));
        res.end();
        next();
      })
      .catch(next)
  })
  
  //添加新评论;
  app.post('/createComment', function (req, res, next) {
  const author = req.session.user._id
  const postId = req.fields.postId
  const content = req.fields.content
  req.ifAjax = true;

    // 校验参数
    try {
      if (!content.length) {
        throw new Error('请填写留言内容')
      }
    } catch (e) {
          reqJson = {error:e.message};
          req.flash('error', e.message)
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          return;
    }

    const comment = {
      author: author,
      postId: postId,
      content: content
    }

    CommentsModel.create(comment)
      .then(function () {
        req.flash('success', '留言成功')
        reqJson = {success:'留言成功'};
        reqJson.postId = postId;
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
        res.write(JSON.stringify(reqJson));
        res.end();
        next();
      })
      .catch(next)
  })
  
  //删除评论;
  app.get('/removeComment',function(req, res, next){
    req.ifAjax = true;
    const commentId = req.query.commentId;
    const author = req.session.user._id;

    CommentsModel.getCommentById(commentId)
    .then(function (comment) {
      if (!comment) {
        throw new Error('留言不存在')
      }
      if (comment.author.toString() !== author.toString()) {
        throw new Error('没有权限删除留言')
      }
      CommentsModel.delCommentById(commentId)
        .then(function () {
          req.flash('success', '删除留言成功')
          // 删除成功后跳转到上一页
          res.redirect('back')
        })
        .catch(next)
    }).catch(next)

    reqJson = {};
    req.flash('success', '留言已删除');
    reqJson = {success:'留言已删除'};
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
        next();
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
        }else if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码错误')
          reqJson = {error:'用户名或密码错误'};
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          return;
        }else{
          req.flash('success', '登录成功')
          // 用户信息写入 session
          delete user.password
          req.session.user = user
          reqJson = {success:'登录成功', user:user};
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          next();
        }
      })
      .catch(next)
  })

  app.post('/validateSignup', function (req, res, next) {
      const name = req.fields.name
      const gender = req.fields.gender
      const bio = req.fields.bio
      const avatar = req.files.avatar.path.split(path.sep).pop()
      let password = req.fields.password
      const repassword = req.fields.repassword
      req.ifAjax = true;
      
      // 校验参数
      try {
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
          throw new Error('请选择性别')
        }
        if (!req.files.avatar.name) {
          throw new Error('缺少头像')
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
          throw new Error('个人简介请限制在 1-30 个字符')
        }
      } catch (e) {
          // 注册失败，异步删除上传的头像
          fs.unlink(req.files.avatar.path)
          reqJson = {error:e.message};
          req.flash('error', e.message)
          res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
          res.write(JSON.stringify(reqJson));
          res.end();
          return;
      }

      // 明文密码加密
      password = sha1(password)

      // 待写入数据库的用户信息
      let user = {
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
      }

      // 用户信息写入数据库
      UserModel.create(user)
          .then(function (result) {
            // 此 user 是插入 mongodb 后的值，包含 _id
            user = result.ops[0]
            // 删除密码这种敏感信息，将用户信息存入 session
            delete user.password
            req.session.user = user
            // 写入 flash
            req.flash('success', '注册成功')
            reqJson = {success:'登录成功'};
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
            res.write(JSON.stringify(reqJson));
            res.end();
            next();
          })
          .catch(function (e) {
            // 注册失败，异步删除上传的头像
            fs.unlink(req.files.avatar.path)
            // 用户名被占用则跳回注册页，而不是错误页
            if (e.message.match('duplicate key')) {
              req.flash('error', '用户名已被占用')
              reqJson = {error:'用户名已被占用'};
              res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
              res.write(JSON.stringify(reqJson));
              res.end();
            }
            next(e)
      })
  })

  app.get('/validateSignout', function (req, res, next) {
    req.ifAjax = true;
    // 清空 session 中用户信息
    req.session.user = null
    req.flash('success', '登出成功')
    reqJson = {success:true};
    res.writeHead(200,{'Content-Type':'application/json;charset=utf-8;'});
    res.write(JSON.stringify(reqJson));
    res.end();
    next();
  })


  //For get source page;
  app.use(function (req, res, next) {
      if(!req.ifAjax){
        var clientui = require('fs').readFileSync('views/myblogIni.html');
        //cors settings;   
        // var origin = (req.headers.origin || "*");  
        // res.setHeader('Access-Control-Allow-Credentials', true); 
        // res.setHeader('Access-Control-Allow-Origin', origin);     
        // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // res.setHeader('Access-Control-Allow-Headers','accept, content-type');
        
        res.writeHead(200,{'Content-Type':'text/html;charset=utf-8;'}); //注意, 如果这里不添加charset=utf-8响应, 页面会显示中文乱码;
        res.write(clientui);
        res.end();
        // res.writeHead(404);
        // res.end();
      }
      next();
  })
}
