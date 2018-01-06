define(['afterRenderProcess'],function(afterRenderProcess){

  return Backbone.View.extend({
       el:$('body'),
       model:blogUser,
       template:_.template(tpl),
       initialize:function(){
            this.template = _.template(tpl); //这条语句很关键, 因为在tpl是在之后路由匹配后被重新赋值的, 而对blogView的template的属性的定义是在路由设置之前的, 也就是说当blogView初始化时, initialize方法并不会重新定义blogView中设置的属性, 而是直接使用它们;
            this.render();
       },
       render:function(){
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
            }).then(function(done){
                var finalData = newModel.toJSON();
                if(newModel.attributes.user && newModel.attributes.user._id){ //如果用户已经处于登录状态;
                  router.navigate('posts?author=' + newModel.attributes.user._id, true);
                }else{
                  var content = App.template(finalData);
                  $('#element').empty().append(content);
                  afterRenderProcess();
                }
                
            }).catch(function(reason){
                //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
            });
            
       }
       
  });
})