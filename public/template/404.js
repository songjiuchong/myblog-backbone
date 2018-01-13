define([],function(){
	return {"html":"<div class='errorPage'>This is a 404 myblog page!</div>"}

})

//这里使用了khaki工具将指定template模板的html内容转换为字符串的形式, 并且为了让_.template()能够正确识别, 这里手动将\'转换为了", 将\n删除了;