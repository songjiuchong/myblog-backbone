require.config({
    baseUrl:'',
    paths:{
        'underscore':'/deps/underscore-min',
        'backbone':'/deps/backbone-min',
        'jquery':'/deps/jquery.min',
        'semantic':'/deps/semantic.min'
    },
    shim:{
        'semantic':{
            deps:['jquery'],
            exports:'semantic'
        },
        'jquery':{
            exports:'$'
        },
        'underscore':{
            exports:'_'
        },
        'backbone':{
            deps:['underscore'],
            exports:'Backbone'
        }
    }
});

require(['backbone','semantic'],function(){

    //为了避免<% %>被footer.ejs解析为ejs模板标签导致发生找不到list变量的错误, 这里改变标签的格式;
    // _.templateSettings = {
    //     evaluate    : /<[%@]([\s\S]+?)[%@]>/g,
    //     interpolate : /<[%@]=([\s\S]+?)[%@]>/g,
    //     escape      : /<[%@]-([\s\S]+?)[%@]>/g
    // };

    $(function(){
        
        //CORS config;
        var proxiedSync = Backbone.sync;      
                Backbone.sync = function(method, model, options) { 
                    options || (options = {});          
                    if (!options.crossDomain) {             
                        options.crossDomain = true;         
                    } //允许跨域,虽然默认为true,但是无法通过options.crossDomain来枚举,可以显式设置options.crossDomain来改变其boolean值;
                    if (!options.xhrFields) {             
                        options.xhrFields = {withCredentials:true};      
                    } //允许跨域发送cookie数据给服务器,默认为false,无法通过options.xhrFields来枚举,可以显式设置options.xhrFields来改变其boolean值;
                    return proxiedSync(method, model, options);
                }; 

        //常量设置;
        const title = 'myblog';
        const description = 'my blog project';
        
        //template;
        var tpl = $('#tpl').html(); //todo, 通过ajax从服务器获取template的内容;

        //Backbone MVC;
        
        window.blogUser = Backbone.Model.extend({
          url:'/userKeyInfo',
          defaults:{
            user:null,
            success:'',
            error:'',
            blog:null
          }
        });
        
        //blogCollection中指定model为blogPost只是为了在fetch时先初始化实例对象中的项和验证fetch获得的项的合法性, 而fetch相关的操作通过blogCollection指定的url就能完成, 所以blogPost中无须设置url;
        window.blogPost = Backbone.Model.extend({
          // defaults:{
          //   author:'',
          //   title:'',
          //   content:'',
          //   pv:0
          // }
        });

        window.blogCollection = Backbone.Collection.extend({
          url:'/getPosts',
          model:blogPost,
          initialize:function(authorid){
            if(authorid){
                this.url = this.url + '?' + authorid;
            }
          }
        });

        // window.authorBlogCollection = Backbone.Collection.extend({
        //   url:'/getPosts?',
        //   model:blogPost
        // });

        window.blogView = Backbone.View.extend({
          el:$('body'),
          model:blogUser,
          template:_.template(tpl),
          initialize:function(authorid){
            this.render(authorid);
          },
          render:function(authorid){
            var newModel = new this.model(
                {blog:{title:title, description:description}}
            );
            var blogUserDone = new Promise(function(resolve, reject){
                newModel.fetch({
                        success:function(model,response,options){
                            resolve('blogUserDone');
                        },
                        error:function(error){
                            //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
                        }
                });
            });
            
            var newPosts = new blogCollection(authorid);
            var blogCollectionDone = new Promise(function(resolve, reject){
                newPosts.fetch({
                    success:function(collection,resp,options){
                        resolve('blogCollectionDone');
                    },error:function(error){
                      //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
                    }
                });
            });
            
            Promise.all([blogUserDone,blogCollectionDone]).then(function(dones){
                var finalData = newModel.toJSON();
                finalData.posts = [];
                for(var i=0; i<newPosts.models[0].attributes.posts.length; i++){
                       finalData.posts[i] = newPosts.models[0].attributes.posts[i];
                }
                var content = App.template(finalData);
                $('#element').empty().append(content);
                afterRenderProcess();
            }).catch(function(reason){
                //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
            });

          }
          // events:{
          //   'click a#mainPage':'toMainPage'
          // },
          // toMainPage:function(){
          //   $('#backbone').toggleClass('changed');
          // }
        });
        

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
            // authorId = location.hash.substring(location.hash.indexOf('author-')+'author-'.length,location.hash.length);
            
            if(authorid){
                window.App = new blogView(authorid);
            }else{
                window.App = new blogView();
            }
            
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
          },
          signout:function(key){
          },
          signup:function(key,page){
          },
          default:function(other){
            alert('url:' + other + "doesn't exist at the moment!");
          }
        });

        var router = new router();
        Backbone.history.start({pushState: true});   
        
        //在页面加载完毕后执行的内容;
        function afterRenderProcess(){
            
            //Backbone router SPA setting;
            $(document).on("click", "a", function(e){
                e.preventDefault(); // This is important
                var href = $(e.currentTarget).attr('href');
                router.navigate(href, true); // <- this part will pass the path to your router
            });

            // 延时清除掉成功、失败提示信息
            if ($('.ui.success.message').length > 0) {
              $('.ui.success.message').fadeOut(3000)
            } else if ($('.ui.error.message').length > 0) {
              $('.ui.error.message').fadeOut(3000)
            }

            //  点击按钮弹出下拉框
            $('.ui.dropdown').dropdown();

            // 鼠标悬浮在头像上，弹出气泡提示框
            $('.post-content .avatar-link').popup({
              inline: true,
              position: 'bottom right',
              lastResort: 'bottom right'
            });
        }
        

    });
});