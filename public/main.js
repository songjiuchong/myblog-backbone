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
        window.title = 'myblog';
        window.description = 'my blog project';
        
        //template;
        window.tpl = '';

        require(['router/router'],function(newRouter){
            router = newRouter;
            Backbone.history.start({pushState: true}); //必须在定义了router之后才能开始监听, 不然监听的规则与router设置无关;
        });
        

    });
});