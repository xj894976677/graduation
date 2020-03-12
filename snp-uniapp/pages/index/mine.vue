<template>
	<view>
		<view>
			<cu-custom bgColor="bg-gradual-blue">
				<block slot="content">我</block>
			</cu-custom>
		</view>

		<view class="cu-card case">
			<view class="cu-item shadow ">
				<view class="margin-top flex-sub cu-item self-center margin-left-bg flex" @tap="change()">
					<view class="cu-avatar round lg" :style="{backgroundImage:'url(' + userInfo.avaterUrl + ')'}"></view>
					<view>
						<view class="text-grey margin-left" style="display: inline; font-size: 40upx;">{{userInfo.userName}}</view>
						<view class=" bg-white margin-left" style="padding-right: 50upx;">
							<view class="cu-progress round" style="margin-top: 10upx;">
								<view class="bg-red" :style="[{ width:loading?levelpercent:''}]">{{levelpercent}}</view>
							</view>
							<view class="flex justify-between">
								<view>会员等级：{{userLevel.levelDesc}}</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="cu-list grid margin-top-sm" :class="['col-' + gridCol, gridBorder?'':'no-border']">
					<view class="cu-item" v-for="(item,index) in messageList" :key="index" v-if="index<gridCol*2">
						<text style="font-size: 30upx;" @tap="nextStep(item.url)">{{item.name}}</text>
						<view @tap="nextStep(item.url)">
							<view style="font-size: 30upx;">{{item.number}}</view>
							<view class="cu-tag badge" v-if="item.badge!=0">
								<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-card case" style="border-radius:10px;" @tap="toVip" v-show="isVip">
					<view class="shadow bg-yellow flex align-center">
						<view class="cuIcon-vip vip-card" style="font-size: 60upx; color:#ED1C24; margin-left: 35upx; margin-top: 10upx;"></view>
						<view style="margin-left: 20upx;" class="vip-card">
							<view style="font-weight: bold; color: #333333;">我的会员</view>
						</view>
						<view style="margin-left: auto; margin-right: 35upx;" class="flex align-center vip-card">
							<view style="font-weight: bold; color: #333333;">尊享豪华特权</view>
							<view class="cuIcon-roundrightfill" style="margin-left: 30upx; color: #333333;"></view>
						</view>
					</view>
				</view>
				
				<view class="cu-card case" style="border-radius:10px;" @tap="toVip" v-show="!isVip">
					<view class="shadow bg-yellow flex align-center">
						<view class="cuIcon-vip vip-card" style="font-size: 60upx; color:#ED1C24; margin-left: 35upx; margin-top: 10upx;"></view>
						<view style="margin-left: 20upx;" class="vip-card">
							<view style="font-weight: bold; color: #333333;">开通会员</view>
						</view>
						<view style="margin-left: auto; margin-right: 35upx;" class="flex align-center vip-card">
							<view style="font-weight: bold; color: #333333;">尽享受豪华特权</view>
							<view class="cuIcon-roundrightfill" style="margin-left: 30upx; color: #333333;"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		

		
		
		<view class="cu-card case" :class="isCard?'no-card':''" v-show="isLogin">
			<view class="cu-item shadow bg-gradual-bluegray">
				<view class="margin-top flex-sub cu-item self-center margin-left-bg">
					<view style="display: inline; font-size: 40upx;">账户总览</view>
				</view>
				<view class="cu-list grid col-4 no-border bg-gradual-bluegray">
					<view class="cu-item margin-left">
						<text style="font-size: 35upx; color: #FFFFFF;">总资产</text>
						<view style="font-size: 35upx;">￥{{assets}}</view>
					</view>	
					<view></view>
					<view class="cu-item" style="margin-left: 50upx;">
						<text style="font-size: 35upx; color: #FFFFFF;">昨日收益</text>
						<view style="font-size: 35upx;">{{lastIncome}}</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					clientNo: null,
					userName: '未登录',
					avaterUrl: '/static/icon/smile-fill.png'
				},
				vipInfo: {
					
				},
				levelpercent: "",
				loading:false,
				acctDetail: {},
				pay: 999,
				income: 555,
				isLogin: false,
				assets: 100000,
				lastIncome: -25,
				userLevel: {},
				messageList: [{
					cuIcon: 'redpacket',
					color: 'alive',
					number: '--',
					badge: 0,
					url: "/pages/bank_card/index/index",
					name: '银行卡'
				}, {
					cuIcon: 'refund',
					color: 'alive',
					number: '--',
					badge: 0,
					name: '卡券'
				}, {
					cuIcon: 'present',
					color: 'alive',
					number: '--',
					badge: 0,
					name: '积分'
				}],
				gridCol: 3,
				isVip: false
			}
		},
		onShow(e) {
			let _this = this;
			
			// 获取用户信息
			_this.isLogin = uni.getStorageSync('isLogin');
			uni.getStorage({
				key: 'vipInfo',
				success: (res) => {
					_this.vipInfo = res.data;
					if(_this.vipInfo.length > 0){
						_this.isVip = true;
					}
				}
			});
			
			
		},
		methods: {
			change() {
				let _this = this;

				if(uni.getStorageSync('isLogin')){
					uni.navigateTo({
						url: '/pages/personal/information'
					});					
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});					
				}
				
			},
			nextStep(url){
				let _this = this;
				console.log("进来了");
				console.log(url);
				uni.navigateTo({
					url: url
				});
			},
			toVip () {
				uni.navigateTo({
					url: "/pages/user/vip/vip"
				})
			}
		},
	}
</script>

<style>
	page {
		background-color: #f9fafb;
	}
	.vip-card {
		margin-top: 10upx;
		margin-bottom: 10upx;
	}
	.margin-left-bg {
		margin-left: 50upx;
	}

	.margin-top-sm {
		margin-top: 20upx;
	}

	.margin-top {
		margin-top: 40upx;
	}

	.margin-right {
		margin-right: 4upx;
	}
</style>
