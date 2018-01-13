define('collection/commentCollection',['model/blogComment'],function(blogComment){
  
  return Backbone.Collection.extend({
          url:'/getComments',
          model:blogComment,
          initialize:function(postId){
            if(postId){
                this.url = this.url + '?' + 'postId=' + postId;
            }
          }
  });
})


		