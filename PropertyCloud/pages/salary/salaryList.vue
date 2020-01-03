<template>
	<view class="container">
		<view class="header">
			<view class="filter flexr0c">
				<input class="filterLeft" placeholder="我负责的全部项目" placeholder-style="color:#000000;margin-left:10rpx" type="text" value="" />
				<input class="filterRight" placeholder="2019年10月"placeholder-style="color:#000000;margin-left:10rpx" type="text" value="" />
			</view>
			<view class="bar flexr0c">
				<view class="barItem actived">
					全部
				</view>
				<view class="barItem">
					待提交
				</view>
				<view class="barItem">
					审核中
				</view>
				<view class="barItem">
					待生效
				</view>
				<view class="barItem">
					已生效
				</view>
			</view>
		</view>
	</view>
</template>

<script>

</script>

<style>
	@import url("../../static/common.css");
	.header {position: fixed;top: 88rpx;height: 200rpx;width: 100%; background-color: #FFFFFF;}

	.filter {height: 112rpx;}
	.bar{width: 100%;height: 88rpx;border-top: 1px dotted #CCCCCC;}
	.barItem{width: 20%;text-align: center;line-height: 88rpx;font-size: 32rpx;box-sizing: border-box;}
	.actived{border-bottom: 4rpx solid #CC0000;}
	.filterLeft{width: 460rpx;height: 60rpx; border: 2rpx solid #F2F2F2;margin-top: 10rpx;margin-left: 12rpx;margin-right: 20rpx;}
	.filterRight{width: 254rpx;height: 60rpx;border: 2rpx solid #F2F2F2;margin-top: 10rpx;margin-right: 20rpx;}
</style>
