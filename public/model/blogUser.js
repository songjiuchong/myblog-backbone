define('model/blogUser',[],function(){

  return Backbone.Model.extend({
          url:'/userKeyInfo',
          defaults:{
            user:null,
            success:'',
            error:'',
            blog:null
          }
  });
})