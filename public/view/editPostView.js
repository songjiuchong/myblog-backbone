define(['afterRenderProcess','model/blogUser','model/blogPost'],function(afterRenderProcess,blogUser,blogPost){

  return Backbone.View.extend({
       el:$('body'),
       model:blogUser,
       template:_.template(tpl),
       initialize:function(postId){
            this.template = _.template(tpl); //这条语句很关键, 因为在tpl是在之后路由匹配后被重新赋值的, 而对blogView的template的属性的定义是在路由设置之前的, 也就是说当blogView初始化时, initialize方法并不会重新定义blogView中设置的属性, 而是直接使用它们;
            this.render(postId);
       },
       render:function(postId){
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
            }).then(function(){
                var newPostModel = new blogPost(postId);
                return new Promise(function(resolve, reject){
                    newPostModel.fetch({
                              success:function(model,response,options){
                                    resolve(newPostModel);
                              },
                              error:function(error){
                                    //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
                              }
                    });
                });
            }).then(function(newPostModel){
                var finalData = newModel.toJSON();
                var newPostData = newPostModel.toJSON();
                Object.assign(finalData, newPostData);
                var content = App.template(finalData);
                $('#element').empty().append(content);
                afterRenderProcess();
                
            }).catch(function(reason){
                //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
            });
            
       }
       
  });
})