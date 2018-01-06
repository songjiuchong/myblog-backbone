define([],function(){

    //在页面加载完毕后执行的内容;
    
    return function afterRenderProcess(){
            //Backbone router SPA setting;
            $(document).on("click", "a", function(e){
                e.preventDefault(); // This is important
                var href = $(e.currentTarget).attr('href');
                router.navigate(href, true); // <- this part will pass the path to your router
            });
            
            $(document).on("click", "form input.ui.button", function(e){
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
                    }
                  );

                }
                // router.navigate(href, true); // <- this part will pass the path to your router
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