define(['afterRenderProcess','model/blogUser','model/blogPost','collection/commentCollection'],function(afterRenderProcess,blogUser,blogPost,commentCollection){

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

            //这里不使用Promise.all()的方式是因为, 多个请求同时对服务器发送可能会导致服务器端报错:Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client;
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
              var newCommentCollection = new commentCollection(postId);
              return new Promise(function(resolve, reject){
                  newCommentCollection.fetch({
                      success:function(collection,resp,options){
                          resolve([newPostModel,newCommentCollection]);
                      },error:function(error){
                        //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
                      }
                  });
              });
            }).then(function(result){
                var newPostModel = result[0];
                var newCommentCollection = result[1];
                var finalData = newModel.toJSON();
                var newPostData = newPostModel.toJSON();
                Object.assign(finalData, newPostData);
                finalData.comments = [];
                for(var i=0; i<newCommentCollection.models[0].attributes.comments.length; i++){
                       finalData.comments[i] = newCommentCollection.models[0].attributes.comments[i];
                }
                var content = App.template(finalData);

                //上一句中的template方法以及将模板中的内容进行了转义, 所以这里需要将类似: &lt;p&gt;123&lt;/p&gt; 转换为<p>123</p>
                function escape2Html(str) { 
                 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
                 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
                } 
                $('#element').empty().append(escape2Html(content));
                afterRenderProcess();
            }).catch(function(reason){
                //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
            });
            
            
            

            // Promise.all([blogUserDone,blogPostDone,commentCollectionDone]).then(function(dones){
            //     var finalData = newModel.toJSON();
            //     var newPostData = newPostModel.toJSON();
            //     Object.assign(finalData, newPostData);
            //     finalData.comments = [];
            //     for(var i=0; i<newCommentCollection.models[0].attributes.comments.length; i++){
            //            finalData.comments[i] = newCommentCollection.models[0].attributes.comments[i];
            //     }
            //     var content = App.template(finalData);
            //     $('#element').empty().append(content);
            //     afterRenderProcess();
            // }).catch(function(reason){
            //     //前端报错通过ajax传到后端, 后端接收后使用next()传递给错误处理中间件; 
            // });

          }
  });
})