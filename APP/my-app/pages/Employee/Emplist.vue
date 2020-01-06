<template>
	<div class="container">
		<div class="bar-wrapper flexr0c">
			<!-- <div class="barItem fz14 subcol flexrac">
				全部项目<div class="iconfont tri">
					&#xe693;
				</div>
			</div>
			<div class="barItem fz14 subcol flexrac">
				在职<div class="iconfont tri">
					&#xe693;
				</div>
			</div>
			<div class="barItem fz14 subcol flexrac">
				排序<div class="iconfont tri">
					&#xe693;
				</div>
			</div>
			<div class="barItem fz14 subcol flexrac">
				筛选<div class="iconfont tri">
					&#xe693;
				</div>
			</div> -->
			<sl-filter class="barItem fz14 subcol" :themeColor="themeColor" :menuList="menuList" @result="result"></sl-filter>
		</div>
			<div class="listItem barBackcol margin-col-10 flexrsc" v-for="item in list" :key="list.index">
				<div class="sub_circle">
					<div class="iconText fz15">
						{{item.name}}
					</div>
				</div>
				<div class="content-wrapper">
					<div class="contentTop flexr fullWidth">
						<div class="fz15">
							{{item.userName}}
						</div>
						<div class="tag1 fz12 thirdcol" v-if="item.tag1">
							已离职
						</div>
						<div class="tag2 fz12" v-if="item.tag2">
							锁定变更
						</div>
						<div class="timeTag fz12" v-if="item.tag3">
							{{time}}天到期
						</div>
						<div class="remainTime fz12 thirdcol" v-else>
							剩余{{time}}天
						</div>
					</div>
					<div class="comeFrom fz13 subcol">
						来自 郑大一附院5号、6号楼保安，13298125901
					</div>
				</div>
			</div>
		<div class="back flexrbc">
			<navigator url="../navigate" open-type="redirect">
				<button class="backHome">
					<div class="iconfont fz15">
						&#xe612;返回首页
					</div>
				</button>
			</navigator>
			<navigator url="addEmp">
				<button class="logout">+ 添加新员工
				</button>
			</navigator>
		</div>
	</div>
</template>

<script>
	import '../../static/common.css'
	import slFilter from '@/components/sl-filter/sl-filter.vue';
	import uniSwipeAction from '../../components/uni-swipe-action/uni-swipe-action.vue'
	export default {
		data() {
			return {
				options: [{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '确认',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				time: 56,
				list: [{
						tag1: true,
						tag2: true,
						tag3: true,
						name: '安',
						userName: '黄栾'
					},
					{
						tag1: false,
						tag2: true,
						tag3: false,
						name: '洁',
						userName: '黄栾'
					},
					{
						tag1: false,
						tag2: false,
						tag3: false,
						name: '洁',
						userName: '黄栾'
					},
					{
						tag1: false,
						tag2: false,
						tag3: false,
						name: '洁',
						userName: '黄栾'
					},
					{
						tag1: false,
						tag2: false,
						tag3: false,
						name: '洁',
						userName: '黄栾'
					},
					{
						tag1: false,
						tag2: false,
						tag3: false,
						name: '洁',
						userName: '黄栾'
					},
				],
				// 下拉筛选
				themeColor: '#000000',
				filterResult: '',
				menuList: [{
						'title': '全部项目',
						'key': 'pro',
						'isSort': true,
						'detailList': [{
								'title': '全部项目',
								'value': ''
							}, {
								'title': '新华通讯社河南分社',
								'value': 'xinhuashe_henan'
							},
							{
								'title': '党的生活杂志',
								'value': 'party_magazine'
							}
						]
					},
					{
						'title': '在职',
						'key': 'on_work',
						'isSort': true,
						'detailList': [{
								'title': '在职',
								'value': 'on'
							},
							{
								'title': '离职',
								'value': 'off'
							},
						]
					},
					{
						'title': '排序',
						'key': 'sort',
						'isSort': true,
						'detailList': [{
								'title': '默认排序',
								'value': ''
							},
							{
								'title': '年龄',
								'value': 'age'
							},
							{
								'title': '薪资最高',
								'value': 'wages_up'
							},
							{
								'title': '离我最近',
								'value': 'location'
							}
						]
					},
					{
						'title': '筛选',
						'key': 'filter',
						'isSort': true,
						'detailList': [{
								'title': '默认排序',
								'value': ''
							},
							{
								'title': '发布时间',
								'value': 'add_time'
							},
							{
								'title': '薪资最高',
								'value': 'wages_up'
							},
							{
								'title': '离我最近',
								'value': 'location'
							}
						]
					}
				]
			}
		},
		onLoad() {

		},
		methods: {
			result(val) {
				console.log('filter_result:' + JSON.stringify(val));
				this.filterResult = JSON.stringify(val, null, 2)
			}
		},
		components: {
			slFilter,
			uniSwipeAction
		}
	}
</script>

<style>
	.container {margin-bottom: 100rpx;}

	.bar-wrapper {height: 100rpx;width: 100%;background-color: #FFFFFF;}

	.barItem {height: 100rpx;text-align: center;width: 100%;border-right: 2rpx solid #d3d3d3;margin-bottom: 10rpx;}

	.barItem:last-child {border-right: none;}

	.tri {color: #c9c9c9;}

	.listItem {height: 130rpx;width: 100%;}

	.iconText {text-align: center;line-height: 92rpx;}

	.content-wrapper {margin-top: 20rpx;}

	.tag1 {height: 40rpx;width: 116rpx;background-color: #CCCCCC;text-align: center;line-height: 40rpx;margin-left: 22rpx;}

	.tag2 {height: 40rpx;width: 128rpx;background-color: #666666;text-align: center;line-height: 40rpx;margin-left: 16rpx;color: #FFFFFF;}

	.timeTag {height: 40rpx;width: 142rpx;background-color: #009900;text-align: center;line-height: 40rpx;margin-left: 128rpx;color: #FFFFFF;}

	.comeFrom {margin-top: 8rpx;}

	.remainTime {position: absolute;right: 18rpx;}

	.logout {height: 100rpx;line-height: 100rpx;width: 534rpx;font-size: 32rpx;text-align: left;background-color: #009900;color: #FFFFFF;border-radius: 0;text-align: center;}

	button:after {border: none;}
</style>
