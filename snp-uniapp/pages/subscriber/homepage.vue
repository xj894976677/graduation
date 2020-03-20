<template>
	<view class="container">
		<view>
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">他的主页</block>
			</cu-custom>
		</view>
		<view class="cu-card case">
			<view class="cu-item shadow ">
				<view class="margin-top flex-sub cu-item self-center flex" style="justify-content: space-between; align-items: center;">
					<view class="flex-sub cu-item self-center margin-left-bg flex">
						<view class="cu-avatar round lg" :style="{backgroundImage:'url(' + avaterUrl + ')'}" @tap="changeImage"></view>
						<view @tap="change()">
							<view class="text-grey margin-left" style="display: inline; font-size: 40upx;">{{userName}}</view>
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
					
					<view class="flex flex-direction" style="margin-right: 50upx;">
						<button class="cu-btn bg-olive lg" @tap="follow">{{followName}}</button>
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
			</view>
		</view>
		

		<form>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<view>
					{{sexIndex!=""?sex[sexIndex]:'选择性别'}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">生日</view>
				<view>
					{{birthday}}
				</view>
		
			</view>
			<view class="cu-form-group">
				<view class="title">手机</view>
				<view>
					{{telephone}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">邮箱</view>
				<view>
					{{mail}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">爱好</view>
				
				<view>
					{{fieldStr}}
				</view>
			</view>
			<view class="cu-form-group flex" style="align-items: center; justify-content: space-between;">
				<view class="title" style="width: 140upx;">简介</view>
				<view>{{tempsyn}}</view>
			</view>	
		</form>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avaterUrl: 'http://a3q.dns06.net.cn/15844990493147.jpeg',
				followName: '关注',
				userId: '',
				userName: '',
				mail: '',
				telephone: '',
				birthday: '',
				synopsis: "",
				tempsyn: "",
				field: '',
				fieldStr: '',
				sex: ['女', '男'],
				isfollowing: false,
				sexIndex: -1,
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
					number: 0,
					badge: 0,
					url: "/pages/subscriber/user_say",
					name: '微博'
				}, {
					cuIcon: 'refund',
					color: 'alive',
					number: 0,
					badge: 0,
					name: '关注'
				}, {
					cuIcon: 'present',
					color: 'alive',
					number: 0,
					badge: 0,
					name: '粉丝'
				}],
				gridCol: 3,
			}
		},
		onLoad(e) {
			let _this = this;
			// 获取用户信息
			_this.userId = e.userId
			console.log(_this.userId);
			uni.request({
				url: this.Server_IP + 'userInformation', //仅为示例，并非真实接口地址。
				data: {
					userId: this.userId
				},
				header: {
					'custom-header': 'userInformation' //自定义请求头信息
				},
				method:"POST",
				dataType:"json",
				success: (res) => {
					console.log(res.data);
					if(res.data.info.code == '0'){
						_this.userName = res.data.data.userName;
						_this.mail = res.data.data.mail;
						_this.telephone = res.data.data.telephone;
						_this.sexIndex = res.data.data.sex;
						_this.birthday = res.data.data.birthday;
						_this.synopsis = res.data.data.synopsis;
						if(_this.synopsis.length > 9){
							var result = _this.synopsis.substr(0,8)
							result += "  ..."
							_this.tempsyn = _this.synopsis
							_this.synopsis = result
						}
						console.log("获取用户信息成功")
					}else{
						console.log("获取用户信息失败")
					}
				},
				fail() {
					console.log("获取用户信息失败")
				}
			});
			uni.request({
				url: this.Server_IP + 'queryField', //仅为示例，并非真实接口地址。
				data: {
					userId: this.userId,
				},
				header: {
					'custom-header': 'queryField' //自定义请求头信息
				},
				method:"POST",
				dataType:"json",
				success: (res) => {
					console.log(res.data);
					if(res.data.info.code == '0'){
						_this.field = JSON.parse(res.data.data.field)
						console.log("获取用户喜好成功")
					}else{
						console.log("获取用户喜好失败")
					}
					if(_this.field.funny == 1){
						_this.fieldStr = "娱乐"
					}
					if(_this.field.anime == 1){
						if(_this.fieldStr == ''){
							_this.fieldStr = "动漫"
						}else{
							_this.fieldStr += ",动漫"
						}
					}
					if(_this.field.news == 1){
						if(_this.fieldStr == ''){
							_this.fieldStr = "新闻"
						}else{
							_this.fieldStr += ",新闻"
						}
					}
					if(_this.field.fashion == 1){
						if(_this.fieldStr == ''){
							_this.fieldStr = "时尚"
						}else{
							_this.fieldStr += ",时尚"
						}
					}
					if(_this.field.motion == 1){
						if(_this.fieldStr == ''){
							_this.fieldStr = "运动"
						}else{
							_this.fieldStr += ",运动"
						}
					}
					if(_this.field.science == 1){
						if(_this.fieldStr == ''){
							_this.fieldStr = "科技"
						}else{
							_this.fieldStr += ",科技"
						}
					}
					if(_this.fieldStr.length > 9){
						var result = _this.fieldStr.substr(0,8)
						result += "  ..."
						_this.fieldStr = result
					}
				},
				fail() {
					console.log("登录信息请求失败")
				}
			});
			uni.request({
				url: this.Server_IP + 'followIm', //仅为示例，并非真实接口地址。
				data: {
					fansId: uni.getStorageSync('userId'),
					userId: this.userId
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
						if(res.data.data.isfollowing != 0){
							_this.isfollowing = true
							_this.followName = "取关"
						}
						console.log("获取关注粉丝成功")
					}else{
						console.log("获取关注粉丝失败")
					}
				},
				fail() {
					console.log("获取关注粉丝失败")
				}
			});
			uni.request({
				url: this.Server_IP + 'sayNum', //仅为示例，并非真实接口地址。
				data: {
					userId: _this.userId
				},
				header: {
					'custom-header': 'sayNum' //自定义请求头信息
				},
				method:"POST",
				dataType:"json",
				success: (res) => {
					console.log(res.data);
					if(res.data.info.code == '0'){
						_this.messageList[0].number = +res.data.data.num;
						console.log("获取微博数量成功")
					}else{
						console.log("获取微博数量失败")
					}
				},
				fail() {
					console.log("获取微博数量失败")
				}
			});
		},
		methods: {
			follow(){
				let _this = this
				if(this.isfollowing == true){
					uni.request({
						url: this.Server_IP + 'delfollow', //仅为示例，并非真实接口地址。
						data: {
							fansId: uni.getStorageSync('userId'),
							userId: this.userId
						},
						header: {
							'custom-header': 'delfollow' //自定义请求头信息
						},
						method:"POST",
						dataType:"json",
						success: (res) => {
							console.log(res.data);
							if(res.data.info.code == '0'){
								_this.messageList[2].number -= 1;
								_this.isfollowing = false
								_this.followName = "关注"
								console.log("取关成功")
							}else{
								console.log("取关失败")
							}
						},
						fail() {
							console.log("取关失败")
						}
					});
				}else{
					uni.request({
						url: this.Server_IP + 'addfollow', //仅为示例，并非真实接口地址。
						data: {
							fansId: uni.getStorageSync('userId'),
							userId: this.userId
						},
						header: {
							'custom-header': 'addfollow' //自定义请求头信息
						},
						method:"POST",
						dataType:"json",
						success: (res) => {
							console.log(res.data);
							if(res.data.info.code == '0'){
								_this.messageList[2].number += 1;
								_this.isfollowing = true
								_this.followName = "取关"
								console.log("关注成功")
							}else{
								console.log("关注失败")
							}
						},
						fail() {
							console.log("关注失败")
						}
					});
				}
			},
			nextStep(url){
				uni.navigateTo({
					url: url + '?title=他的微博'
				});	
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
