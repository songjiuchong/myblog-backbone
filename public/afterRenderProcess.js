define([],function(){

    //在页面加载完毕后执行的内容;
    
    return function afterRenderProcess(){
            //Backbone router SPA setting;
            $(document).on("click", "a", function(e){
                e.preventDefault(); // This is important
                var href = $(e.currentTarget).attr('href');
                if(href.indexOf('remove') != -1){  //如果是删除操作先询问操作者;
                    if(window.confirm('是否执行删除操作?')){
                        router.navigate(href, true);
                    }
                    return;
                }
                router.navigate(href, true); // <- this part will pass the path to your router
            });
          
            $('form.segment').submit(function(e){
                e.preventDefault(); // This is important
                

                if(window.location.pathname == '/signin'){
                  var username = $('input[name = "name"]').val();
                  var userpassword = $('input[name = "password"]').val();
                    if(username.length<4 || userpassword.length<6){ //这里只是象征性添加前端对用户注册的检查;
                          var content = '<div class="ui error message"><p>用户名长度必须大于3位,密码长度必须大于5位</p></div>';
                          $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                          return;
                    }
                  $.post("validateSignin",
                    {
                      name:username,
                      password:userpassword
                    },
                    function(data,status){
                      if(data && data.error){
                        var content = '<div class="ui error message"><p>' + data.error + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                      }else if(data && data.success && data.user){
                        var content = '<div class="ui success message"><p>' + data.success + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                        router.navigate('/posts?author=' + data.user._id, true);
                      }
                    },
                    "json"
                  );

                }else if(window.location.pathname == '/signup'){
                  var username = $('input[name = "name"]').val();
                  var userpassword = $('input[name = "password"]').val();
                    if(username.length<4 || userpassword.length<6){ //这里只是象征性添加前端对用户注册的检查;
                          var content = '<div class="ui error message"><p>用户名长度必须大于3位,密码长度必须大于5位</p></div>';
                          $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                          return;
                    }
                  var userrepassword = $('input[name = "repassword"]').val();
                  var bio = $('textarea[name = "bio"]').text();
                  if (userpassword !== userrepassword){
                    var content = '<div class="ui error message"><p>两次输入的密码不同</p></div>';
                    $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                    return;
                  }
                  
                  $.ajax({
                    url: "validateSignup", // Url to which the request is send
                    type: "POST",             // Type of request to be send, called as method
                    data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                    contentType: false,       // The content type used when sending data to the server.
                    cache: false,             // To unable request pages to be cached
                    processData:false,        // To send DOMDocument or non processed data file it is set to false
                    success: function(data)   // A function to be called if request succeeds
                    {
                      if(data && data.error){
                        var content = '<div class="ui error message"><p>' + data.error + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                      }else if(data && data.success){
                        var content = '<div class="ui success message"><p>' + data.success + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                        router.navigate('/posts', true);
                      }
                    }
                  });

                }else if(window.location.pathname == '/posts/create'){
                    $.ajax({
                    url: "/createPost", // Url to which the request is send
                    type: "POST",             // Type of request to be send, called as method
                    data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                    contentType: false,       // The content type used when sending data to the server.
                    cache: false,             // To unable request pages to be cached
                    processData:false,        // To send DOMDocument or non processed data file it is set to false
                    success: function(data)   // A function to be called if request succeeds
                    {
                      if(data && data.error){
                        var content = '<div class="ui error message"><p>' + data.error + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                      }else if(data && data.success){
                        var content = '<div class="ui success message"><p>' + data.success + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                        router.navigate('/posts?author=' + data.post.author, true);
                      }
                    }
                  });

                }

            });

            $('form.reply').submit(function(e){
                e.preventDefault(); // This is important
                
                $.ajax({
                    url:'createComment',
                    type: "POST",             // Type of request to be send, called as method
                    data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                    contentType: false,       // The content type used when sending data to the server.
                    cache: false,             // To unable request pages to be cached
                    processData:false,        // To send DOMDocument or non processed data file it is set to false
                    success: function(data)   // A function to be called if request succeeds
                    {
                      if(data && data.error){
                        var content = '<div class="ui error message"><p>' + data.error + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                      }else if(data && data.success){
                        var content = '<div class="ui success message"><p>' + data.success + '</p></div>';
                        $('.ui.grid:eq(1) .eight.wide.column').empty().append(content);
                        Backbone.history.fragment = null;
                        // router.navigate('/posts?post=' + data.postId, {trigger: true});
                        router.navigate('/posts?post=' + data.postId, true);
                      }
                    }
                });
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
})