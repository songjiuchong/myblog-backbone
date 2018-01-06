define([],function(){
    //路由;
        var router = Backbone.Router.extend({
          routes:{
            '':'init',
            'posts':'posts',
            'posts?author=:authorid':'posts',
            'posts/create':'posts_create',
            'posts/:postId':'posts_Id',
            'posts/:postId/edit':'posts_Id_edit',
            'posts/:postId/remove':'posts_Id_remove',
            'signin':'signin',
            'signout':'signout',
            'signup':'signup',
            '*other':'default'
          },
          init:function(){
              location.href = '/posts';
          },
          posts:function(authorid){
            require(['template/component/header','template/posts','view/blogView'],function(header,posts,blogView){
                var tplHeader  = header.html;
                var tplPosts  =  posts.html;
                tpl = tplHeader + tplPosts;
                if(authorid){
                    window.App = new blogView(authorid);
                }else{
                    window.App = new blogView();
                }
            });
            
          },
          posts_create:function(){

          },
          posts_Id:function(id){

          },
          posts_Id_edit:function(id){

          },
          posts_Id_remove:function(id){

          },
          signin:function(){
                require(['template/component/header','template/signin','view/signinView'],function(header,signin,signinView){
                    var tplHeader  = header.html;
                    var tplSignin  =  signin.html;
                    tpl = tplHeader + tplSignin;
                    window.App = new signinView();
                });
          },
          signout:function(key){
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