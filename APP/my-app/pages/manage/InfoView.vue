<template>
	<div class="container pageBackcol">
		<!-- <div class="nav">
			<text class="close">X</text>
			<text class="content">我的个人信息</text>
			<div class="iconfont option">
				&#xe6c9;
			</div>
		</div> -->
		<div class="bold_line"></div>
		<div class="header barBackcol flexrbc">
			<div class="flexrsc">
				<div class="avatar-wrapper">
					<image class="avatar" src="../../static/logo.png" mode=""></image>
				</div>
				<div class="info">
					<div class="fz15">
						资深CIO
					</div>
					<div class="subcol fz14">
						圆方集团-物业一公司-56部
					</div>
				</div>
			</div>
			<div class="position">
				项目经理
			</div>
		</div>
		<div class="intro flexrbc">
			<text class="name">真实姓名</text>
			<text class="trueName">黄栾</text>
		</div>
		<div class="intro flexrbc">
			<text class="name">所属地区</text>
			<text class="trueName">河南省-郑州市-金水区</text>
		</div>
		<div class="intro flexrbc">
			<text class="name">个人介绍</text>
			<text class="trueName">我是一颗任性的螺丝钉</text>
		</div>
		<div class="intro flexrbc phone">
			<text class="name">联系手机</text>
			<text class="trueName">13298125901</text>
		</div>
		<div class="intro flexrbc">
			<text class="name">绑定微信</text>
			<text class="trueName">gh_sadfasdfsdd2561</text>
		</div>
		<button class="offWechat">解绑当前微信</button>
		<div class="back flexrbc">
			<navigator url="Index" open-type="redirect" >
				<button class="backHome">
					<div class="iconfont backIcon fz15">
						&#xe612;返回首页
					</div>
				</button>
			</navigator>
			<button class="logout">→ 退出当前账号
			</button>
		</div>
	</div>
</template>

<script>
	import "../../static/common.css";
	export default {
		data() {
			return {
				title: 'Hello',
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.container {height: 100vh;margin-bottom: 100rpx;}

	.bold_line {height: 20rpx;}

	.header {height: 160rpx;width: 100%;margin-bottom: 20rpx;}

	.avatar-wrapper {width: 100rpx;height: 100rpx;padding: 0 20rpx;}

	.avatar {width: 100rpx;height: 100rpx;border-radius: 50rpx;}

	.position {font-size: 24rpx;background-color: #999999;color: #F0F0F0;width: 148rpx;height: 40rpx;line-height: 40rpx;text-align: center;margin-top: -60rpx;margin-right: 20rpx;}

	.intro {background-color: #FFFFFF;height: 100rpx;width: 100%;border-bottom: 1rpx solid #E4E4E4;}

	.name {font-size: 30rpx;color: #666666;padding-left: 14rpx;}

	.trueName {font-size: 28rpx;color: #000000;padding-right: 20rpx;}

	.phone {margin-top: 20rpx;}

	.offWechat {background-color: #FFFFFF;border-radius: 10rpx;height: 84rpx;line-height: 84rpx;width: 96%;margin-top: 20rpx;font-size: 28rpx;}

	.logout {height: 100rpx;line-height: 100rpx;width: 70%;font-size: 32rpx;text-align: left;background-color: #999999;color: #FFFFFF;border-radius: 0;text-align: center;}

	button:after {border: none;}
</style>
