define([],function(){
	return {"html":"<div class='ui grid'><div class='four wide column'></div><div class='eight wide column'><form class='ui form segment' method='post'><div class='field required'><label>用户名</label><input placeholder='用户名' type='text' name='name'></div><div class='field required'><label>密码</label><input placeholder='密码' type='password' name='password'></div><input type='submit' class='ui button fluid' value='登录'></form></div></div>"}

})

//这里使用了khaki工具将指定template模板的html内容转换为字符串的形式, 并且为了让_.template()能够正确识别, 这里手动将\'转换为了", 将\n删除了;