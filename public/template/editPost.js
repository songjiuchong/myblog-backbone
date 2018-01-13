define([],function(){
	return {"html":"<div class='ui grid'><div class='four wide column'><a class='avatar'href='/posts?author=<%= user._id %>'data-title='<%= user.name %> | <%= ({m: '男', f: '女', x: '保密'})[user.gender] %>'data-content='<%= user.bio %>'><img class='avatar' src='/img/<%= user.avatar %>'></a></div><div class='eight wide column'><form class='ui form segment' method='post' action='/posts/<%= post._id %>/edit'><div class='field required'><label>标题</label><input type='text' name='title' value='<%= post.title %>'></div><div class='field required'><label>内容</label><textarea name='content' rows='15'><%= post.content %></textarea></div><input type='submit' class='ui button' value='发布'></form></div></div>"}

})

//这里使用了khaki工具将指定template模板的html内容转换为字符串的形式, 并且为了让_.template()能够正确识别, 这里手动将\'转换为了", 将\n删除了;