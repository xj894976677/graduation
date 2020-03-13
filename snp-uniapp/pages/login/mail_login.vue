<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">邮箱登录</block>
		</cu-custom>
		<form>

			<view class="cu-form-group">
				<view class="title">邮箱</view>
				<input placeholder="请输入邮箱" name="input" v-model="mail" disabled="true"></input>
				<button class='cu-btn bg-blue' v-show="captchaFlag" @tap="getCaptcha">{{captchaName}}</button>
				<button class='cu-btn bg-grey' disabled v-show="!captchaFlag">{{captchaTime}}秒后重新获取</button>
			</view>
			<view class="cu-form-group">
				<view class="title">验证码</view>
				<input placeholder="请输入邮箱中的验证码" type="number" name="captcha" maxlength="6" v-model="code"></input>
			</view>
			
			
			<view class="padding flex flex-direction margin-top">
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="next">登录</button>
			</view>
		</form>
		
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import graceChecker from '@/common/graceChecker.js'
	export default {
		data() {
			return {
				mail: '',
				code: '',
				captchaFlag: true,
				captchaName: "获取验证码",
				captchaTime: 60,
			};
		},
		onLoad(object) {
			this.mail = uni.getStorageSync('mail')
		},
		methods: {
			// 获取验证码
			getCaptcha() {
				let _this = this;
				_this.captchaFlag = false;
				_this.captchaShow = true;
				var interval = setInterval(() => {--_this.captchaTime;}, 1000)
				setTimeout(() => {
					clearInterval(interval)
					_this.captchaFlag = true
					_this.captchaTime = 60
				}, 60000)
				console.log(this.mail)
				uni.request({
					url: 'http://localhost:8181/mailcode', //仅为示例，并非真实接口地址。
					data: {
						mail: this.mail
					},
					header: {
						'custom-header': 'mailcode' //自定义请求头信息
					},
					method:"POST",
					dataType:"json",
					success: (res) => {
						console.log(res.data);
						if(res.data.info.code == '0'){
							
							console.log(res.data.data.userId)
							console.log("成功")
							
							
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.info.message
							});
						}
					},
				});

				
			},
			next() {
				let _this = this
				var codeRule = [
					{
						name: 'code',
						checkType: 'notnull',
						errorMsg: '请输入验证码'
					},
					{
						name: 'code',
						checkType: 'string',
						checkRule: '6',
						errorMsg: '验证码为6个字符'
					}
				];
				var checkRes = graceChecker.check(_this, codeRule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					_this.isFocus = true;
					return;
				}
				uni.request({
					url: 'http://localhost:8181/checkCode', //仅为示例，并非真实接口地址。
					data: {
						mail: this.mail,
						code: this.code
					},
					header: {
						'custom-header': 'mailcode' //自定义请求头信息
					},
					method:"POST",
					dataType:"json",
					success: (res) => {
						console.log(res.data);
						if(res.data.info.code == '0'){
							console.log("验证码正确")
							uni.request({
								url: 'http://localhost:8181/userIdfromMail', //仅为示例，并非真实接口地址。
								data: {
									mail: this.mail,
								},
								header: {
									'custom-header': 'mailcode' //自定义请求头信息
								},
								method:"POST",
								dataType:"json",
								success: (res) => {
									console.log(res.data);
									if(res.data.info.code == '0'){
										console.log("验证码正确")
										uni.setStorageSync('userId', res.data.data.userId);
										uni.setStorageSync('isLogin', true);
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
						}else{
							uni.showToast({
								icon: 'none',
								title: res.data.info.message
							});
						}
					},
				});

			}
		}
	}
</script>

<style>
page{
	background-color: #FFFFFF;
}

.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
