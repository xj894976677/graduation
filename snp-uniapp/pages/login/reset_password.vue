<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">重置密码</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<view class="title">新的密码</view>
				<input placeholder="请输入密码" type="number" name="captcha" maxlength="6" v-model="password"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input placeholder="请再次输入" type="number" name="captcha" maxlength="6" v-model="repassword"></input>
			</view>
			<view class="padding flex flex-direction margin-top round">
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="determine">确定修改</button>
			</view>
		</form>
		
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import graceChecker from '@/common/graceChecker.js'
	import md5 from '@/common/md5.js'
	export default {
		data() {
			return {
				mail: '',
				code: '',
				userId: '',
				password: '',
				repassword: ''
			};
		},
		onLoad(object) {
			this.mail = object.mail
			this.code = object.code
			this.userId = object.userId
		},
		methods: {
			determine(){
				let _this = this
				var registerRule = [
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
					},
					{
						name: 'repassword',
						checkType: 'same',
						checkRule: _this.password,
						errorMsg: '两次输入密码不一致,请检查'
					}
				];
				var checkRes = graceChecker.check(_this, registerRule);
				if(!checkRes){
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					_this.isFocus = true;
					return;
				}
				uni.request({
				    url: 'http://localhost:8181/resetPassword', //仅为示例，并非真实接口地址。
				    data: {
				        code: this.code,
						mail: this.mail,
						userId: this.userId,
						password: md5(this.password)
				    },
				    header: {
				        'custom-header': 'resetPassword' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							uni.setStorageSync('userId', res.data.data.userId);
							console.log("成功")
							uni.reLaunch({
							    url: './login'
							});
							uni.showToast({
								title: "密码重置成功",
								icon: "none"
							});
						}else{
							console.log(res.data.info.message);
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
