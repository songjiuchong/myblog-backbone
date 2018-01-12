define(['template/component/header','template/post','view/postView','template/createPost','view/createPostView'],function(headerModule,postModule,postViewModule,createPostModule,createPostView){
    //路由;
        var router = Backbone.Router.extend({
          routes:{
            '':'init',
            'posts':'posts',
            'posts?author=:authorid':'posts',
            // 'posts/:postId':'posts_Id',
            'posts?post=:postId':'posts',
            'posts/create':'posts_create',
            // 'posts/:postId/edit':'posts_Id_edit',
            'posts/:postId/remove':'removePost',
            'comments/:commentId/remove':'removeComment',
            'signin':'signin',
            'signout':'signout',
            'signup':'signup',
            '*other':'default'
          },
          init:function(){
              location.href = '/posts';
          },
          posts:function(authorid){
            if(authorid && !authorid.startsWith('post=')){
              require(['template/component/header','template/posts','view/blogView'],function(header,posts,blogView){
                  var tplHeader  = header.html;
                  var tplPosts  =  posts.html;
                  tpl = tplHeader + tplPosts;
                  window.App = new blogView(authorid);
              });
            }else if(authorid && authorid.startsWith('post=')){
                  var tplHeader  = headerModule.html;
                  var tplPost  =  postModule.html;
                  tpl = tplHeader + tplPost;
                  window.App = new postViewModule(authorid.slice(5)); //截取post=后的字符串;
            }else{
                  require(['template/component/header','template/posts','view/blogView'],function(header,posts,blogView){
                  var tplHeader  = header.html;
                  var tplPosts  =  posts.html;
                  tpl = tplHeader + tplPosts;
                  window.App = new blogView();
              });
            }
          },
          posts_create:function(){
              var tplHeader  = headerModule.html;
              var tplPost  =  createPostModule.html;
              tpl = tplHeader + tplPost;
              window.App = new createPostView();
          },
          posts_Id:function(postId){
                
          },
          posts_Id_edit:function(id){

          },
          removePost:function(postId){
                $.ajax({
                    type: 'GET',
                    url: '/removePost?postId=' + postId,
                    dataType: 'json',
                    cache: false
                }).done(function(data){
                    if(data && data.success){
                        var newHref = '/posts?author=' + data.author;
                        Backbone.history.fragment = null;
                        newRouter.navigate(newHref, true);
                    }
                });
          },
          removeComment:function(commentId){
                $.ajax({
                    type: 'GET',
                    url: '/removeComment?commentId=' + commentId,
                    dataType: 'json',
                    cache: false
                }).done(function(data){
                    if(data && data.success){
                        var newQuery = $('.post-content .ui.segment h3 a').attr('href').slice(12);
                        var newHref = '/posts?post=' + newQuery;
                        Backbone.history.fragment = null;
                        newRouter.navigate(newHref, true);
                    }
                });
          },
          signin:function(){
                require(['template/component/header','template/signin','view/signinView'],function(header,signin,signinView){
                    var tplHeader  = header.html;
                    var tplSignin  =  signin.html;
                    tpl = tplHeader + tplSignin;
                    window.App = new signinView();
                });
          },
          signout:function(){
                $.ajax({
                    type: 'GET',
                    url: 'validateSignout',
                    dataType: 'json',
                    cache: false
                }).done(function(data){
                    if(data && data.success){
                        newRouter.navigate('/posts', true);
                    }
                });
                
          },
          signup:function(){
                require(['template/component/header','template/signup','view/signupView'],function(header,signup,signupView){
                    var tplHeader  = header.html;
                    var tplSignup  =  signup.html;
                    tpl = tplHeader + tplSignup;
                    window.App = new signupView();
                });
          },
          default:function(other){
            alert('url:' + other + "doesn't exist at the moment!");
          }
        });

        var newRouter = new router();

        return newRouter;
})