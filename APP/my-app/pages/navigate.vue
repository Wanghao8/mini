<template>
	<view class="container">
		<uni-grid class="grid" :show-border="false" :column="3" borderColor="#d0dee5">
			<uni-grid-item marker="badge">
				<navigator class="nav flexccc" url="manage/Index">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						Index
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="manage/Index1">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						Index1
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="manage/ComView">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						ComView
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="manage/DepView">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						DepView
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="manage/InfoView">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						InfoView
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="manage/Login">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						Login
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="manage/SignIn">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						SignIn
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="Employee/Emplist">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						Emplist
					</view>
				</navigator>
			</uni-grid-item>
			<uni-grid-item>
				<navigator class="nav flexccc" url="Employee/test">
					<view class="iconfont">
						&#xe6eb;
					</view>
					<view class="title">
						AddEmp
					</view>
				</navigator>
			</uni-grid-item>
		</uni-grid>
	</view>

</template>

<script>
	import '../static/common.css'
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	export default {
		components: {
			uniGrid,
			uniGridItem
		}
	}
</script>

<style>
	.container {position: relative;width: 100%;}

	.grid {margin: 5%;}
	/* .uni-grid-item__box{position: relative;}
	.uni-grid-item__box:after{position: absolute;content: '';-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);top: 0;left: 0;width: 100%;border-top: 2rpx solid #d0dee5;border-radius: 0;} */
	.uni-grid-item{background-color: #FFFFFF;}

	.nav {position: relative;height: 100%;width: 100%;background-color: #EFEFF4;text-align: center;background-color: #FFFFFF;}

	.iconfont {font-size: 50rpx;line-height: 50rpx;}

	.title {line-height: 50rpx;font-size: 28rpx;}
</style>
