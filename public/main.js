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


        //Backbone MVC;
        
        window.blogModel = Backbone.Model.extend({
          url:'/userKeyInfo',
          defaults:{
            user:{},
            success:'',
            error:'',
            router:'',
            blog:{}
          }
        });

        window.blogCollection = Backbone.Collection.extend({
          model:blogModel
        });

        var tpl = $('#tpl').html(); //todo, 通过ajax从服务器获取template的内容;
        window.blogView = Backbone.View.extend({
          el:$('body'),
          model:blogModel,
          template:_.template(tpl),
          initialize:function(){
            this.render();
          },
          render:function(){
            var newModel = new this.model(
                {blog:{title:title, description:description}}
            );
            newModel.fetch({
                    success:function(model,response){
                    },
                    error:function(error){
                    }
            });
            var content = this.template(newModel.toJSON());
            $('#element').append(content);
          }
        });
        

        //路由;
        var router = Backbone.Router.extend({
          routes:{
            '':'posts',
            'posts':'posts',
            'posts/create':'posts_create',
            'posts/:postId':'posts_Id',
            'posts/:postId/edit':'posts_Id_edit',
            'posts/:postId/remove':'posts_Id_remove',
            'signin':'signin',
            'signout':'signout',
            'signup':'signup',
            '*other':'default'
          },
          posts:function(){

            window.App = new blogView();
            
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
          }
        });

        var router = new router();
        Backbone.history.start();   
        
        // 延时清除掉成功、失败提示信息
        if ($('.ui.success.message').length > 0) {
          $('.ui.success.message').fadeOut(3000)
        } else if ($('.ui.error.message').length > 0) {
          $('.ui.error.message').fadeOut(3000)
        }

        //  点击按钮弹出下拉框
        console.log($('.ui.dropdown').length);
        $('.ui.dropdown').dropdown();

        // 鼠标悬浮在头像上，弹出气泡提示框
        $('.post-content .avatar-link').popup({
          inline: true,
          position: 'bottom right',
          lastResort: 'bottom right'
        });

    });
});