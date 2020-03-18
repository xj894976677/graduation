<template>
	<view>
		<view>
			<cu-custom bgColor="bg-gradual-blue">
				<block slot="content">我</block>
			</cu-custom>
		</view>
		<view class="cu-card case">
			<view class="cu-item shadow ">
				<view class="margin-top flex-sub cu-item self-center margin-left-bg flex">
					<view class="cu-avatar round lg" :style="{backgroundImage:'url(' + userInfo.avaterUrl + ')'}" @tap="changeImage"></view>
					<view @tap="change()">
						<view class="text-grey margin-left" style="display: inline; font-size: 40upx;">{{userInfo.userName}}</view>
						<view class=" bg-white margin-left" style="padding-right: 50upx;">
							<view class="cu-progress round" style="margin-top: 10upx;">
								<view class="bg-red" :style="[{ width:loading?levelpercent:''}]">{{levelpercent}}</view>
							</view>
							<view class="flex justify-between">
								<view>{{synopsis}}</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="cu-list grid margin-top-sm" :class="['col-' + gridCol, gridBorder?'':'no-border']">
					<view class="cu-item" v-for="(item,index) in messageList" :key="index" v-if="index<gridCol*2">
						<text style="font-size: 30upx;" @tap="toList(item.name)">{{item.name}}</text>
						<view @tap="toList(item.name)">
							<view style="font-size: 30upx;">{{item.number}}</view>
							<view class="cu-tag badge" v-if="item.badge!=0">
								<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
							</view>
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
					avaterUrl: 'http://a3q.dns06.net.cn/15844990493147.jpeg'
				},
				vipInfo: {
					
				},
				synopsis: "",
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
					number: '0',
					badge: 0,
					url: "/pages/bank_card/index/index",
					name: '微博'
				}, {
					cuIcon: 'refund',
					color: 'alive',
					number: '0',
					badge: 0,
					name: '关注'
				}, {
					cuIcon: 'present',
					color: 'alive',
					number: '0',
					badge: 0,
					name: '粉丝'
				}],
				gridCol: 3,
			}
		},
		onShow() {
			console.log(this.isLogin)
			console.log(1)
			let _this = this;
			// 获取用户信息
			if(uni.getStorageSync('isLogin') != ""){
				_this.isLogin = uni.getStorageSync('isLogin');
			}
			if(uni.getStorageSync('userName') != ""){
				_this.userInfo.userName = uni.getStorageSync('userName')
			}else{
				_this.userInfo.userName = "未登录"
			}
			if(uni.getStorageSync('synopsis') != ""){
				_this.synopsis = uni.getStorageSync('synopsis')
				if(_this.synopsis.length > 15){
					_this.synopsis = _this.synopsis.substr(0,15) + "..."
				}
			}else{
				_this.synopsis = ""
			}
			console.log(_this.isLogin)
			console.log("获取关注信息")
			uni.request({
				url: this.Server_IP + 'followIm', //仅为示例，并非真实接口地址。
				data: {
					fansId: "",
					userId: uni.getStorageSync('userId')
				},
				header: {
					'custom-header': 'followIm' //自定义请求头信息
				},
				method:"POST",
				dataType:"json",
				success: (res) => {
					console.log(res.data);
					if(res.data.info.code == '0'){
						_this.messageList[1].number = +res.data.data.follow;
						_this.messageList[2].number = +res.data.data.fans;
						console.log("获取关注粉丝成功")
					}else{
						console.log("获取关注粉丝失败")
					}
				},
				fail() {
					console.log("获取关注粉丝失败")
				}
			});
			console.log("获取完成")
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
			toList(name){
				if(name == "微博"){
					
				}
				if(name == "关注"){
					uni.request({
						url: this.Server_IP + 'queryfollow', //仅为示例，并非真实接口地址。
						data: {
							userId: uni.getStorageSync('userId')
						},
						header: {
							'custom-header': 'queryfollow' //自定义请求头信息
						},
						method:"POST",
						dataType:"json",
						success: (res) => {
							console.log(res.data);
							if(res.data.info.code == '0'){
								uni.navigateTo({
									url: '/pages/subscriber/user_list?title=我的关注&userList='+res.data.data.follow
								});	
							}else{
								console.log("获取关注粉丝失败")
							}
						},
						fail() {
							console.log("获取关注粉丝失败")
						}
					});
				}
				if(name == "粉丝"){
					uni.request({
						url: this.Server_IP + 'queryfans', //仅为示例，并非真实接口地址。
						data: {
							userId: uni.getStorageSync('userId')
						},
						header: {
							'custom-header': 'queryfans' //自定义请求头信息
						},
						method:"POST",
						dataType:"json",
						success: (res) => {
							console.log(res.data);
							if(res.data.info.code == '0'){
								uni.navigateTo({
									url: '/pages/subscriber/user_list?title=我的粉丝&userList='+res.data.data.fans
								});	
							}else{
								console.log("获取关注粉丝失败")
							}
						},
						fail() {
							console.log("获取关注粉丝失败")
						}
					});
				}
			},
			changeImage () {
				uni.navigateTo({
					url: "/pages/personal/change_headpic"
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
	.window-bottom{
		position: fixed;  
		bottom: var(--window-bottom);
	}
</style>
