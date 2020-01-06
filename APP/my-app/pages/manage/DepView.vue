<template>
	<div class="container pageBackcol">
		<!-- <div class="nav">
			<text class="close">X</text>
			<text class="content">物业一公司56部</text>
			<div class="iconfont option">
				&#xe6c9;
			</div>
		</div> -->
		<div class="header flexc">
			<!-- <div class=""> -->
			<div class="tinyTitle subTitle">
				物业一公司
			</div>
			<!-- </div> -->
			<div class="circle">
				<div class="iconfont mail">
					&#xe797;
				</div>
			</div>
			<div class="title">
				56部（杨石开）
			</div>
		</div>
		<div class="bar flexrac">
			<div class="barItem actived">
				项目20个
			</div>
			<div class="barItem">
				工作
			</div>
			<div class="barItem">
				督导
			</div>
			<div class="barItem">
				考勤
			</div>
		</div>
		<div class="msg flexrbc">
			<div class="flexrsc">
				<div class="sub_circle">
					<div class="iconfont icons">
						&#xe60f;
					</div>
				</div>
				<div class="msgContent">
					<div class="flexrbc">
						<div class="fz15">
							郑大一附院5号楼、6号楼
						</div>
						<div class="tips">
							有督导
						</div>
					</div>
					<div class="msgIntro">
						隶属56部（孟德琴），负责560员工
					</div>
				</div>
			</div>
		</div>
		<div class="comment-wrapper flexr0s">
			<div class="image-wrapper">
				<image class="commentImg" src="../../static/image/zhp.png"></image>
			</div>
			<div class="comContent flexc">
				<div class="comTop flexrbc">
					<div class="userName">
						周慧萍 （一公司56部）
					</div>
					<div class="iconfont fold">
						&#xe706;
					</div>
				</div>
				<div class="commentMsg">
					郑大一附院5号楼、6号楼绿化太大，进行整体修剪维护处理
				</div>
				<div class="submsg flexrbc">
					<div class="flexrac">
						<div class="comTime">
							20分钟前 ·
						</div>
						<div class="comAddress">
							郑大一附院5、6号楼
						</div>
					</div>
					<div class="iconfont commentIcon">
						&#xe60c;
					</div>
				</div>
			</div>
		</div>
		<div class="msg flexrbc">
			<div class="flexrsc">
				<div class="sub_circle">
					<div class="iconfont icons">
						&#xe609;
					</div>
				</div>
				<div class="msgContent">
					<div class="flexrbc">
						<div class="fz15">
							杨石开（督导）
						</div>
						<div class="tips green">
							正在整改中
						</div>
					</div>
					<div class="msgIntro">
						处理不干净，大面积出现脏东西，地上有烟头
					</div>
				</div>
			</div>
		</div>
		<div class="msgBottom flexrbc">
			<div class="time">
				3小时前
			</div>
			<div class="address">
				郑大一附院5、6号楼项目
			</div>
		</div>
		<div class="msg flexrbc">
			<div class="flexrsc">
				<div class="sub_circle">
					<div class="iconfont icons">
						&#xe61e;
					</div>
				</div>
				<div class="msgContent">
					<div class="flexrbc">
						<div class="fz15">
							黄栾
						</div>
						<div class="tips">
							今日打卡 10 次
						</div>
					</div>
					<div class="msgIntro">
						最后位置，郑东新区郑大一附院附近
					</div>
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
			<button class="logout">+关注 杨石开
			</button>
			<div class="phoneBtn">
				<div class="iconfont phone">
					&#xe602;
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
	.container {height: 100vh;margin-bottom: 100rpx;}

	.header {height: 200rpx;width: 100%;background-color: #D7D7D7;position: relative;}

	.tinyTitle {margin-top: 20rpx;margin-left: 596rpx;}

	.circle {height: 92rpx;width: 92rpx;border-radius: 46rpx;background-color: #FFFFFF;margin-top: -28rpx;margin-left: 324rpx;}

	.mail {font-size: 50rpx;text-align: center;line-height: 100rpx;color: #999999;}

	.title {font-size: 30rpx;margin-top: 14rpx;margin-left: 282rpx;}

	.bar {height: 80rpx;background-color: #FFFFFF;width: 100%;}

	.barItem {width: 25%;font-size: 28rpx;text-align: center;line-height: 80rpx;}

	.actived {border-bottom: 4rpx solid #999999;}

	.fold {margin-right: 20rpx;color: #CCCCCC;}

	.msg {height: 130rpx;width: 100%;background-color: #FFFFFF;margin: 14rpx 0;}

	.msgContent {width: 620rpx;}

	.icons {font-size: 40rpx;color: #999999;line-height: 92rpx;text-align: center;}

	.msgIntro {font-size: 26rpx;color: #999999;word-break: keep-all;white-space: nowrap;}

	.tips {font-size: 24rpx;color: #999999;float: right;margin-top: -30rpx;margin-right: 12rpx;}

	.msgBottom {height: 72rpx;width: 100%;background-color: #FFFFFF;border-top: 1rpx solid #f2f2f2;margin-top: -14rpx;}

	.time {font-size: 24rpx;margin-left: 14rpx;}

	.address {font-size: 26rpx;color: #666666;margin-right: 14rpx;}

	.logout {height: 100rpx;line-height: 100rpx;width: 55%;font-size: 32rpx;text-align: left;background-color: #999999;color: #FFFFFF;border-radius: 0rpx;text-align: center;}

	.comment-wrapper {height: 236rpx;width: 100%;background-color: #FFFFFF;}

	.image-wrapper {width: 92rpx;height: 92rpx;margin: 20rpx;}

	.commentImg {width: 92rpx;height: 92rpx;}

	.comContent {height: 100%;}

	.comTop {width: 100%;margin-top: 28rpx;}

	.userName {font-size: 30rpx;color: #296C9C;}

	.commentMsg {font-size: 30rpx;line-height: 40rpx;height: 130rpx;margin-top: 14rpx;margin-right: 14rpx;margin-bottom: 14rpx;}

	.commentIcon {float: right;margin-right: 20rpx;color: #4C84AC;}

	.submsg {width: 100%;margin-bottom: 30rpx;}

	.comTime {font-size: 24rpx;color: #C3C3C3;}

	.comAddress {font-size: 24rpx;color: #296C9C;}

	button:after {border: none;}
</style>
