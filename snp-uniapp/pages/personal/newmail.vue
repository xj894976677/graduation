<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">修改邮箱</block>
		</cu-custom>
		<form>

			<view class="cu-form-group">
				<view class="title">新邮箱</view>
				<input placeholder="请输入邮箱" name="input" v-model="mail"></input>
				<button class='cu-btn bg-blue' v-show="captchaFlag" @tap="getCaptcha">{{captchaName}}</button>
				<button class='cu-btn bg-grey' disabled v-show="!captchaFlag">{{captchaTime}}秒后重新获取</button>
			</view>
			<view class="cu-form-group">
				<view class="title">验证码</view>
				<input placeholder="请输入邮箱中的验证码" name="captcha" maxlength="6" v-model="code"></input>
			</view>
			
			
			<view class="padding flex flex-direction margin-top">
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="determine">确定修改</button>
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
				previousmail: '',
				previouscode: '',
				mail: '',
				code: '',
				captchaFlag: true,
				captchaName: "获取验证码",
				captchaTime: 60,
			};
		},
		onLoad(object) {
			this.previousmail = uni.getStorageSync('mail')
			this.previouscode = object.code
		},
		methods: {
			// 获取验证码
			getCaptcha() {
				let _this = this
				var mailRule = [
					{
						name: 'mail',
						checkType: 'notnull',
						errorMsg: '请输入邮箱'
					},
					{
						name: 'mail',
						checkType: 'email',
						errorMsg: '邮箱格式错误'
					},
					{
						name: 'mail',
						checkType: 'notsame',
						checkRule: _this.previousmail,
						errorMsg: '新邮箱和旧邮箱一致，无法获取'
					}
				];
				var checkRes = graceChecker.check(_this, mailRule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					_this.isFocus = true;
					return;
				}
				
				uni.request({
					url: this.Server_IP + 'queryMail', //仅为示例，并非真实接口地址。
					data: {
						mail: this.mail
					},
					header: {
						'custom-header': 'queryMail' //自定义请求头信息
					},
					method:"POST",
					dataType:"json",
					success: (res) => {
						console.log(res.data);
						if(res.data.info.code == '0'){
							
							console.log(res.data.data.userId)
							console.log("成功")
							// 获取验证码按钮进入倒计时状态
							_this.captchaFlag = false;
							_this.captchaShow = true;
							var interval = setInterval(() => {--_this.captchaTime;}, 1000)
							setTimeout(() => {
								clearInterval(interval)
								_this.captchaFlag = true
								_this.captchaTime = 60
							}, 60000)
							console.log(this.mail)
							// 更新数据库中的验证码
							uni.request({
								url: this.Server_IP + 'mailcode', //仅为示例，并非真实接口地址。
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
										uni.showToast({
											icon: 'none',
											title: "验证码发送成功，此邮件可能被归类到垃圾箱中，请注意"
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
							return
						}
					},
				});
				
			},
			determine() {
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
					url: this.Server_IP + 'checkNewMailCode', //仅为示例，并非真实接口地址。
					data: {
						mail: this.mail,
						code: this.code,
						previousmail: this.previousmail,
						previouscode: this.previouscode,
						userId: uni.getStorageSync('userId')
					},
					header: {
						'custom-header': 'checkNewMailCode' //自定义请求头信息
					},
					method:"POST",
					dataType:"json",
					success: (res) => {
						console.log(res.data);
						if(res.data.info.code == '0'){
							console.log("验证码正确")
							uni.setStorageSync('mail', this.mail);
							uni.navigateBack({
							    delta: 2
							});
							uni.showToast({
								icon: 'none',
								title: '修改成功'
							});
						}else{
							console.log("失败")
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
