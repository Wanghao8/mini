<template>
	<view class="container pageBackcol">
		<view class="header">
			<!-- <view class="nav">
				<text class="close"></text>
				<text class="content"></text>
				<view class="iconfont option">
					&#xe6c9;
				</view>
			</view> -->
			<view class="top flexrac">
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe666;
					</view>
					<view class="title">
						项目3个
					</view>
				</view>
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe601;
					</view>
					<view class="title">
						员工
					</view>
				</view>
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe61e;
					</view>
					<view class="title">
						打卡
					</view>
				</view>
				<view class="flexccc topItem">
					<view class="iconfont icont">
						&#xe670;
					</view>
					<view class="title">
						个人
					</view>
				</view>
			</view>
			<view class="bottom flexrac">
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="flexr sub">
							<view class="iconfont botIcon">
								&#xe61d;
							</view>
							<view class="circle2">
								<view class="num">
									1
								</view>
							</view>
						</view>
						<view class="bomTxt">
							督导反馈
						</view>
					</view>
				</view>
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="iconfont botIcon">
							&#xe666;
						</view>
						<view class="bomTxt">
							保险申报
						</view>
					</view>
				</view>
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="flexr sub">
							<view class="iconfont botIcon">
								&#xe604;
							</view>
							<view class="circle2">
								<view class="num">
									1
								</view>
							</view>
						</view>
						<view class="bomTxt">
							请假外派
						</view>
					</view>
				</view>
				<view class="bar-wrapper">
					<view class="flexccc barItem">
						<view class="iconfont botIcon">
							&#xe78d;
						</view>
						<view class="bomTxt">
							工资考勤
						</view>
					</view>
				</view>
			</view>
		</view>

		<navigator class="edit flexrbc" url="../edit/AddLog">
			<view class="flexrac input-wrapper">
				<!-- <view class="avatar-wrapper">
					<image class="avatar" src="../../static/logo.png" mode=""></image>
				</view> -->
				<input class="record fz15" type="text" value="" placeholder="记录下我的工作" />
			</view>
			<view class="circle1">
				<view class="iconfont camera">
					&#xe68a;
				</view>
			</view>
		</navigator>

		<view class="comment-wrpper flexras">
			<view class="comImg-wrapper">
				<image class="comImg" src="../../static/image/zhp.png" mode=""></image>
			</view>
			<view class="comContent flexccc">
				<view class="comTop flexrbc">
					<view class="userName">
						周慧萍 （一公司56部）
					</view>
					<view class="iconfont fold">
						&#xe706;
					</view>
				</view>
				<view class="msg">
					<p>郑大一附院5号楼、6号楼绿化太大，进行整体修剪维护处理</p>
					<p>保安人员着装有部分太久，督促他们再买一套以方便更换</p>
				</view>
				<view class="submsg flexrbc">
					<view class="flexrac">
						<view class="time">
							20分钟前 ·
						</view>
						<view class="address">
							郑大一附院5、6号楼
						</view>
					</view>
					<view class="iconfont commentIcon">
						&#xe60c;
					</view>
				</view>
				<view class="comment">
					<view class="triangle"></view>
					<view class="commentBox">
						<view class="commentItem">
							<view class="flexrsc commentTop">
								<view class="name">
									孟德琴
								</view>
								<view class="commentTime">
									10分钟前
								</view>
							</view>
							<view class="commentmsg">
								上个月我去过一次，绿化确实要换了，可以
							</view>
						</view>
						<view class="commentItem">
							<view class="flexrsc commentTop">
								<view class="name">
									李娴莉 物业总经理
								</view>
								<view class="commentTime">
									1天前
								</view>
							</view>
							<view class="commentmsg">
								同时看下其他绿化带是否一起修剪
							</view>
						</view>
						<view class="commentItem">
							<view class="flexrsc commentTop">
								<view class="name">
									李圆方 总经理
								</view>
								<view class="commentTime">
									3天前
								</view>
							</view>
							<view class="commentmsg">
								同时看下其他绿化带是否一起修剪
							</view>
						</view>
						<view class="commentItem">
							<view class="flexrsc commentTop">
								<view class="name">
									张三 施工队长
								</view>
								<view class="commentTime">
									10天前
								</view>
							</view>
							<view class="commentmsg">
								已处理完成，总计修剪6个绿化带，其他检查过，暂不用修剪
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import '../../static/common.css'
</script>

<style>
	.container {height: 100vh;}

	.nav {background-color: #333333;width: 100vw;height: 96rpx;line-height: 96rpx;}

	.close {font-size: 40rpx;margin: 24rpx;color: #e4e4e4;}

	.content {font-size: 34rpx;color: #CCCCCC;}

	.option {font-size: 48rpx;color: #E4E4E4;float: right;margin-right: 30rpx;}

	.icont {font-size: 60rpx;color: #E4E4E4;}

	.top {background-color: #666666;height: 180rpx;}

	.topItem {width: 25%;}

	.pro {color: white;}

	.option {color: #E4E4E4;}

	.title {font-size: 30rpx;color: #F2F2F2;}

	.bottom {background-color: #FFFFFF;height: 140rpx;}

	.bar-wrapper {height: 140rpx;width: 25%;border-right: 1rpx solid #F2F2F2;}

	.barItem {height: 140rpx;}

	.botIcon {font-size: 48rpx;}

	.bomTxt {font-size: 26rpx;}

	.sub {margin-left: 34rpx;}

	.circle2 {height: 32rpx;width: 32rpx;border-radius: 16rpx;background-color: #666666;color: #FFFFFF;margin-left: 4rpx;margin-top: -6rpx;}

	.num {text-align: center;line-height: 32rpx;font-size: 20rpx;}

	.edit {margin: 20rpx 0;height: 100rpx;width: 100%;background-color: #FFFFFF;}

	.avatar-wrapper {height: 60rpx;width: 80rpx;margin-left: 26rpx;margin-right: 20rpx;}

	.avatar {height: 60rpx;width: 78rpx;}

	.input-wrapper {width: 100%;}

	.record {width: 80%;}

	.circle1 {width: 60rpx;height: 60rpx;border-radius: 30rpx;background-color: #F5F5F5;margin-right: 20rpx;}

	.camera {line-height: 60rpx;text-align: center;font-size: 40rpx;}

	.comment-wrpper {background-color: #FFFFFF;padding-right: 20rpx;}

	.comImg-wrapper {width: 96rpx;height: 96rpx;margin: 20rpx;}

	.comImg {width: 96rpx;height: 96rpx;}

	.userName {font-size: 30rpx;color: #296c9c;}

	.fold {color: #CCCCCC;}

	.comTop {width: 100%;margin-top: 28rpx;margin-bottom: 8rpx;}

	.msg {height: 196rpx;}

	.msg p {font-size: 30rpx;line-height: 49rpx;}

	.commentIcon {float: right;color: #4C84AC;}

	.time {font-size: 24rpx;color: #545454;}

	.address {font-size: 24rpx;color: #4c84ac;margin-left: 6rpx;}

	.submsg {width: 100%;}

	.triangle {width: 0;height: 0;border: 16rpx solid;border-color: transparent transparent #EFEFEF;margin-left: 14rpx;}

	.commentBox {background-color: #EFEFEF;width: 600rpx;}

	.name {font-size: 24rpx;color: #4C84AC;margin-right: 10rpx;}

	.commentTime {font-size: 24rpx;}

	.commentmsg {font-size: 26rpx;margin-left: 8rpx;color: #615f5f;}

	.commentItem {margin-bottom: 10rpx;margin-left: 10rpx;}

	.commentTop {padding: 10rpx;}
</style>
