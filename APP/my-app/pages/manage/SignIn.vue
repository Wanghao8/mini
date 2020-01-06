<template>
	<div class="container pageBackcol">
		<!-- <div class="nav">
			<text class="close">X</text>
			<text class="navContent">克拉玛依圆方非公党建学院教学班</text>
			<div class="iconfont option">
				&#xe6c9;
			</div>
		</div> -->
		<div class="header flexc0c">
			<div class="circle1">
				<div class="iconfont clock">
					&#xe61d;
				</div>
			</div>
			<div class="text">
				上午打卡签到
			</div>
			<div class="headerTime">
				2017年12月05日 17点45分25秒
			</div>
		</div>
		<div class="title flexr0c">
			<div class="iconfont mark">
				&#xe60e;
			</div>
			<div class="content">
				<div class="contentTop">
					克拉玛依圆方非公党建学院教学班
				</div>
				<div class="fz14 subcol">
					300人教学，11月22日开课，持续3天
				</div>
			</div>
		</div>
		<div class="intro flexc0s">
			<div class="introTop">
				打卡说明
			</div>
			<div class="introItem">
				<p>1. 打卡时间开始后，持续30分钟属于正常打卡</p>
				<p>2. 超出规定时间打卡，会计入异常并附加最后成绩单中</p>
			</div>
		</div>
		<div class="footer flexrbc">
			<div class="left flexc0s">
				<div class="fz15">
					剩余打卡时间
				</div>
				<div class="subTitle">
					开始后30分钟倒计时，超出时间将计入迟到哦
				</div>
			</div>
			<div class="circle2">
				<div class="num">
					56
				</div>
			</div>
		</div>
		<div class="back flexrbc">
			<navigator url="Index" open-type="redirect" >
				<button class="backHome">
					<div class="iconfont fz15">
						&#xe612;返回首页
					</div>
				</button>
			</navigator>
			<button class="logout">→ 打卡签入
			</button>
		</div>
	</div>
</template>

<script>
	import '../../static/common.css'
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

	.header {height: 244rpx;width: 100%;background-color: #CCCCCC;}

	.circle1 {width: 84rpx;height: 84rpx;border-radius: 42rpx;background-color: #FFFFFF;margin-top: 32rpx;}

	.clock {font-size: 42rpx;line-height: 84rpx;text-align: center;color: #999999;}

	.text {font-size: 32rpx;margin-top: 30rpx;}

	.headerTime {font-size: 28rpx;color: #999999;margin-top: 8rpx;}

	.mark {font-size: 96rpx;color: #CCCCCC;background-color: #FFFFFF;margin: 20rpx;}

	.title {height: 136rpx;background-color: #FFFFFF;margin-top: 22rpx;}

	.contentTop {font-size: 30rpx;color: #993300;}

	.intro {height: 210rpx;width: 100%;background-color: #FFFFFF;margin-top: 22rpx;}

	.introTop {font-size: 30rpx;margin: 20rpx;}

	.introItem {font-size: 28rpx;color: #666666;margin: 16rpx 20rpx;}

	.footer {height: 136rpx;width: 100%;background-color: #FFFFFF;margin-top: 18rpx;}

	.left {margin-left: 20rpx;}

	.circle2 {width: 100rpx;height: 100rpx;border-radius: 50rpx;background-color: #E4E4E4;margin-right: 14rpx;}

	.num {line-height: 100rpx;text-align: center;font-size: 50rpx;color: #A8A8A8;}

	.logout {height: 100rpx;line-height: 100rpx;width: 70%;font-size: 32rpx;text-align: left;background-color: #999999;color: #FFFFFF;border-radius: 0rpx;text-align: center;}

	button:after {border: none;}
</style>
