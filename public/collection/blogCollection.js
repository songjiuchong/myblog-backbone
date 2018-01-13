define('collection/blogCollection',['model/blogPost'],function(blogPost){
  
  //blogCollection中指定model为blogPost只是为了在fetch时先初始化实例对象中的项和验证fetch获得的项的合法性, 而fetch相关的操作通过blogCollection指定的url就能完成, 所以blogPost中无须设置url;
  
  return Backbone.Collection.extend({
          url:'/getPosts',
          model:blogPost,
          initialize:function(authorid){
            if(authorid){
                this.url = this.url + '?' + authorid;
            }
          }
  });
})


		