<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">登录</block>
		</cu-custom>
		<image src="../../static/image/1.jpg" style="height: 190upx;"></image>
<!-- 		<view style="color: #5e69ff;align-content: center; display: flex; width: 100%; justify-content: center; font-size: 50upx; font-weight: 600;" >
			世界因你而精彩
		</view> -->
		<view class="cu-card case" :class="isCard?'no-card':''" style="align-items: center; margin-top: 0upx;">
			<view class="cu-item shadow">
				
				<view class="cu-form-group">
					<input placeholder="请输入账号" name="input" v-model="userId" style="font-size: 32upx;"></input>
				</view>
				<view class="cu-form-group">
					<input type="password" placeholder="请输入密码" name="input" v-model="password" style="font-size: 32upx;"></input>
				</view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg round" @tap="login">登录</button>
			</view>
			<view style="display: flex; justify-content: space-between;">
				<view style="color: #888888; font-size: 30upx; margin-left: 40upx; margin-top: 16upx;" data-target="bottomModal" @tap="showModal">忘记密码</view>
				<view style="color: #888888; font-size: 30upx; margin-right: 40upx; margin-top: 16upx;" @tap="register">注册账户</view>
			</view>
		</view>

		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog">
				<view class="padding-xl bg-gradual-blue">
					<button class="modelbutton bg-gradual-blue" @tap="forgetPassword">重置密码</button>
					<button class="modelbutton bg-gradual-blue" @tap="mailLogin" style="margin-top: 20upx;">邮箱验证码登录</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import util from '@/common/util.js'
	import graceChecker from '@/common/graceChecker.js'
	import md5 from '@/common/md5.js'
	export default {
		data() {
			return {
				modalName: null,
				userId: "",
				password: ""
			}
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			login(){
				let _this = this
				var registerRule = [{
						name: 'userId',
						checkType: 'notnull',
						checkRule: '',
						errorMsg: '请输入账号'
					},
					{
						name: 'password',
						checkType: 'notnull',
						errorMsg: '请输入登录密码'
					},
					{
						name: 'password',
						checkType: 'string',
						checkRule: '6,32',
						errorMsg: '密码最为 6-32 个字符'
					}
				];
				
				var checkRes = graceChecker.check(_this, registerRule);
				if (checkRes) {
					uni.request({
						url: this.Server_IP + 'login', //仅为示例，并非真实接口地址。
						data: {
							userId: this.userId,
							password: md5(this.password)
						},
						header: {
							'custom-header': 'login' //自定义请求头信息
						},
						sslVerify: false,
						method:"POST",
						dataType:"json",
						success: (res) => {
							console.log(res.data);
							if(res.data.info.code == '0'){
								uni.setStorageSync('userId', res.data.data.userId);
								uni.setStorageSync('isLogin', true);
								console.log(res.data.data.userId)
								console.log("成功")
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
											uni.setStorageSync('userName', res.data.data.userName);
											uni.setStorageSync('mail', res.data.data.mail);
											uni.setStorageSync('telephone', res.data.data.telephone);
											uni.setStorageSync('sex', res.data.data.sex);
											uni.setStorageSync('birthday', res.data.data.birthday);
											uni.setStorageSync('synopsis', res.data.data.synopsis);
											console.log("获取用户信息成功")
										}else{
											console.log("获取用户信息失败")
										}
									},
									fail() {
										console.log("登录信息请求失败")
									}
								});
								
								uni.request({
									url: this.Server_IP + 'queryField', //仅为示例，并非真实接口地址。
									data: {
										userId: this.userId
									},
									header: {
										'custom-header': 'queryField' //自定义请求头信息
									},
									method:"POST",
									dataType:"json",
									success: (res) => {
										console.log(res.data);
										if(res.data.info.code == '0'){
											uni.setStorageSync('field', JSON.parse(res.data.data.field));
											// console.log(res.data.data.field)
											// var field = JSON.parse(res.data.data.field)
											// console.log(field.userId);
											// console.log(field)
											console.log("获取用户喜好成功")
										}else{
											console.log("获取用户喜好失败")
										}
									},
									fail() {
										console.log("登录信息请求失败")
									}
								});
								uni.switchTab({
									url: '/pages/index/index'
								});
							}else{
								uni.showToast({
									icon: 'none',
									title: res.data.info.message
								});
							}
						},
					});
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					_this.isFocus = true;
					return;
				}
			},
			register(){
				uni.navigateTo({
				    url: './register'
				});
			},
			forgetPassword(){
				console.log("forgetPassword")
				uni.navigateTo({
				    url: './forget_password'
				});
			},
			mailLogin(){
				console.log("mailLogin")
				uni.navigateTo({
				    url: './mail_login'
				});
			}
		}
	}
</script>

<style>
page{
	background-color: #FFFFFF;
	height: 80%;
	display: flex;
	flex-direction: column;
	justify-content: center;

}
.container{
		/* 定义flex容器 */
		display: flex;
         /*设置容器内部容器的排列方向*/	
		height: 100%;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		
	}
.modelbutton{
	color: #ffffff;
	font-size: 50upx;
}
</style>
