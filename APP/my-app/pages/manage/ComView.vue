<template>
	<div class="container pageBackcol">
		<!-- <div class="nav">
			<text class="close">X</text>
			<text class="content">物业一公司详情</text>
			<div class="iconfont option">
				&#xe6c9;
			</div>
		</div> -->
		<div class="header flexrbc">
			<div class="flexrsc">
				<div class="circle">
					<div class="iconfont mail">
						&#xe797;
					</div>
				</div>
				<div class="info">
					<div class="fz15">
						物业一公司
					</div>
					<div class="fz13 subcol">
						负责人孟德琴，辖24个部门，300个项目
					</div>
				</div>
			</div>
			<div class="iconfont funnel">
				&#xe672;
			</div>
		</div>
		<div class="bar flexrac">
			<div class="barItem actived">
				部门
			</div>
			<div class="barItem">
				项目
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
						&#xe628;
					</div>
				</div>
				<div class="msgContent">
					<div class="flexrbc">
						<div class="fz15">
							56部
						</div>
						<div class="tips">
							有督导
						</div>
					</div>
					<div class="fz13 thirdcol">
						孟德琴，目前总计服务项目24个
					</div>
				</div>
			</div>
		</div>
		<div class="msg flexrbc">
			<div class="flexrsc">
				<div class="sub_circle">
					<div class="iconfont icons">
						&#xe628;
					</div>
				</div>
				<div class="msgContent">
					<div class="flexrbc">
						<div class="fz15">
							56部
						</div>
						<div class="tips">
							有督导
						</div>
					</div>
					<div class="fz13 thirdcol">
						孟德琴，目前总计服务项目24个
					</div>
				</div>
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
					<div class="fz13 thirdcol">
						隶属56部（孟德琴），负责560员工
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
					<div class="fz13 thirdcol">
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
					<div class="fz13 thirdcol">
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
			<button class="logout">+关注 孟德琴
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
				fz15: 'Hello',
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

	.header {height: 140rpx;background-color: #D7D7D7;}

	.circle {height: 100rpx;width: 100rpx;border-radius: 50rpx;background-color: #FFFFFF;margin: 20rpx;}

	.mail {font-size: 50rpx;text-align: center;line-height: 100rpx;color: #999999;}

	.funnel {font-size: 50rpx;margin-top: -40rpx;margin-right: 16rpx;color: #999999;}

	.bar {background-color: #FFFFFF;height: 80rpx;width: 100%;}

	.barItem {width: 25%;font-size: 28rpx;text-align: center;line-height: 80rpx;}

	.actived {border-bottom: 4rpx solid #999999;}

	.msg {height: 130rpx;width: 100%;background-color: #FFFFFF;margin: 14rpx 0;}

	.icons {font-size: 40rpx;color: #999999;line-height: 92rpx;text-align: center;}

	.msgContent {width: 620rpx;}

	.tips {font-size: 24rpx;color: #999999;margin-top: -30rpx;margin-right: 12rpx;}

	.msgBottom {height: 72rpx;width: 100%;background-color: #FFFFFF;border-top: 2rpx solid #f2f2f2;margin-top: -14rpx;}

	.time {font-size: 24rpx;margin-left: 14rpx;}

	.address {font-size: 26rpx;color: #666666;margin-right: 14rpx;}

	.logout {height: 100rpx;line-height: 100rpx;width: 55%;font-size: 32rpx;text-align: left;background-color: #999999;color: #FFFFFF;border-radius: 0rpx;text-align: center;}

	button:after {border: none;}
</style>
