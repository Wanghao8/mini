<template>
	<div class="container pageBackcol">
		<!-- <div class="nav">
			<text class="close">X</text>
			<text class="content">克拉玛依圆方非公党建学院教学班</text>
			<div class="iconfont option">
				&#xe6c9;
			</div>
		</div> -->
		<div class="header flexc">
			<div class="history subTitle">
				历史参加
			</div>
			<div class="title-wrapper flexr">
				<div class="circle1">
					<div class="iconfont nine">
						&#xe6eb;
					</div>
				</div>
				<div class="flexc">
					<div class="fz16">
						克拉玛依圆方非公党建学院教学班
					</div>
					<div class="headerTime">
						300人教学，11月22日开课，持续3天
					</div>
				</div>
			</div>
		</div>
		<div class="bar flexrac">
			<div class="barItem actived">
				课程
			</div>
			<div class="barItem">
				签到
			</div>
			<div class="barItem">
				联系
			</div>
			<div class="barItem">
				个人
			</div>
		</div>
		<div class="date">
			第一天（2017-11-23）
		</div>
		<div class="timeLine">
			<div class="flexr">
				<div class="time">
					<p>08:30</p>
					<p>09:30 </p>
				</div>
				<div class="flexc content-wrapper">
					<div class="contentTitle">
						开班仪式
					</div>
					<div class="fz13 thirdcol flexr">
						<div class="target">
							温誓词
						</div>
						<div class="target">
							唱红歌
						</div>
						<div class="target">
							激情教学
						</div>
						<div class="target">
							亮身份
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="timeLine">
			<div class="flexr">
				<div class="time">
					<p>09:30</p>
					<p>11:30 </p>
				</div>
				<div class="flexc content-wrapper">
					<div class="contentTitle">
						参观非公党建学院及企业文化
					</div>
					<div class="fz13 thirdcol flexr">
						120分钟，王振宇主讲，了解参观企业文化
					</div>
				</div>
			</div>
		</div>
		<div class="timeLine">
			<div class="flexr">
				<div class="time">
					<p>11:30</p>
					<p>13:30 </p>
				</div>
				<div class="flexc content-wrapper">
					<div class="contentTitle">
						午餐＋休息
					</div>
					<div class="fz13 thirdcol flexr">
						60分钟，二楼就餐，会议室可以休息
					</div>
				</div>
			</div>
		</div>
		<div class="date">
			第二天（2017-11-24）
		</div>
		<div class="timeLine">
			<div class="flexr">
				<div class="time">
					<p>09:30</p>
					<p>11:30 </p>
				</div>
				<div class="flexc content-wrapper">
					<div class="contentTitle">
						参观非公党建学院及企业文化
					</div>
					<div class="fz13 thirdcol flexr">
						120分钟，王振宇主讲，了解参观企业文化
					</div>
				</div>
			</div>
		</div>
		<div class="timeLine">
			<div class="flexr">
				<div class="time">
					<p>11:30</p>
					<p>13:30 </p>
				</div>
				<div class="flexc content-wrapper">
					<div class="contentTitle">
						午餐＋休息
					</div>
					<div class="fz13 thirdcol flexr">
						60分钟，二楼就餐，会议室可以休息
					</div>
				</div>
			</div>
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
	.container {height: 100vh;}

	.header {height: 180rpx;width: 100%;background-color: #CCCCCC;}

	.history {margin-top: 20rpx;margin-left: 624rpx;}

	.title-wrapper {margin-top: 10rpx;}

	.circle1 {width: 84rpx;height: 84rpx;border-radius: 42rpx;background-color: #FFFFFF;margin: 0 18rpx 24rpx 20rpx;}

	.nine {font-size: 40rpx;color: #999999;line-height: 84rpx;text-align: center;}

	.headerTime {font-size: 28rpx;color: #797979;}

	.bar {height: 80rpx;width: 100%;background-color: #FFFFFF;}

	.barItem {width: 25%;font-size: 28rpx;text-align: center;line-height: 80rpx;}

	.actived {border-bottom: 4rpx solid #999999;}

	.date {height: 70rpx;width: 100%;background-color: #EFEFF4;font-size: 28rpx;line-height: 70rpx;margin-left: 8rpx;}

	.timeLine {height: 132rpx;width: 100%;background-color: #FFFFFF;border-bottom: 1rpx solid #D7D7D7;}

	.time {width: 114rpx;height: 100rpx;border-right: 1rpx solid #E4E4E4;margin-top: 26rpx;margin-bottom: 26rpx;margin-left: 2rpx;}

	.time p {font-size: 28rpx;color: #666666;line-height: 50rpx;text-align: center;}

	.content-wrapper {margin-top: 20rpx;margin-left: 16rpx;}

	.contentTitle {font-size: 28rpx;margin-bottom: 14rpx;}

	.target {width: 122rpx;height: 44rpx;background-color: #E4E4E4;font-size: 24rpx;text-align: center;line-height: 44rpx;color: #999999;margin-right: 14rpx;}
</style>
