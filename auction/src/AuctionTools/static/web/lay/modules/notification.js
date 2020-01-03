/**
 @ Name：layui.notification 通知模块（测试）
 @ Author：贤心
 @ License：MIT 
 */

layui.define('layer', function(exports) {
	var $ = layui.$,
		layer = layui.layer
		,
		notification = {
			open: function(options) {
				return layer.msg(options || '');
			}
		};
	exports('notification', notification);
});