define('model/blogPost',[],function(){

  return Backbone.Model.extend({
  		url:'/getPost',
  		initialize:function(postId){
            if(postId){
                this.url = this.url + '?' + 'postId=' + postId;
            }
          }
         // defaults:{
         //   author:'',
         //   title:'',
         //   content:'',
         //   pv:0
         // }
  });
})