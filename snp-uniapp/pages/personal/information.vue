<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">个人信息</block>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">昵称</view>
				<input placeholder="请输入用户名" name="input" v-model="userName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">简介</view>
				<input placeholder="请输入您的介绍" name="input" v-model="synopsis"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">性别</view>
				<picker @change="sexChange" :value="index" :range="sex">
					<view class="picker">
						{{index>-1?sex[index]:'选择性别'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">生日</view>
				<picker mode="date" :value="date" start="1900-01-01" end="2020-01-01" @change="DateChange">
					<view class="picker">
						{{birthday}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">手机</view>
				<input placeholder="请输入手机号" maxlength="11" v-model="telephone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">邮箱</view>
				<input placeholder="请输入邮箱" name="input" v-model="mail"></input>
				<button class='cu-btn bg-blue' v-show="captchaFlag" @tap="getCaptcha">{{captchaName}}</button>
				<button class='cu-btn bg-grey' disabled v-show="!captchaFlag">{{captchaTime}}秒后重新获取</button>
			</view>
			<view class="cu-form-group"  v-show="captchaShow">
				<view class="title">验证码</view>
				<input placeholder="请输入验证码" type="number" name="captcha" maxlength="6" v-model="captcha"></input>
			</view>
			
			
			<view class="padding flex flex-direction margin-top">
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="change">确认修改</button>
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
				userName: '',
				mail: '',
				birthday: '1990-01-01',
				telephone: '',
				synopsis: '',
				sex: ['男', '女'],
				index: -1,
				captcha: '',
				captchaFlag: true,
				captchaShow: false,
				captchaName: "获取验证码",
				captchaTime: 60,
			};
		},
		onLoad(e) {
			console.log("加载信息界面")
			let _this = this;
			_this.userName = uni.getStorageSync('userName')
			_this.mail = uni.getStorageSync('mail')
			_this.birthday = uni.getStorageSync('birthday')
			_this.telephone = uni.getStorageSync('telephone')
			_this.synopsis = uni.getStorageSync('synopsis')
			if(uni.getStorageSync('sex') == '男'){
				_this.index = 0
			}
			if(uni.getStorageSync('sex') == '女'){
				_this.index = 1
			}
		},
		methods: {
			sexChange(e) {
				this.index = e.detail.value
			},
			DateChange(e) {
				this.date = e.detail.value
			},
			// 获取验证码
			getCaptcha() {
				let _this = this;
				console.log(_this.mail)
				console.log(_this.birthday)
				console.log(_this.index)
				
				if (_this.mail != uni.getStorageSync('mail')) {
					if (_this.captchaFlag) {
						_this.captchaFlag = false;
						_this.captchaShow = true;
						var interval = setInterval(() => {--_this.captchaTime;}, 1000)
						setTimeout(() => {
							clearInterval(interval)
							_this.captchaFlag = true
							_this.captchaTime = 60
						}, 60000)
					}
				} else {
					uni.showToast({
						title: "邮箱并未改变，无法发送验证码",
						icon: "none"
					});
					return;
				}
				
			},
			change() {
				let _this = this;
				// 注册信息校验
				var captchaRule = [
					{
						name: 'captcha',
						checkType: 'notnull',
						errorMsg: '请输入验证码'
					},
					{
						name: 'captcha',
						checkType: 'string',
						checkRule: '6',
						errorMsg: '验证码为 6 个数字'
					}
				];
				var teletphoneRule = [
					{
						name: 'phone',
						checkType: 'phoneno',
						checkRule: '',
						errorMsg: '手机号格式不正确'
					}
				];
				
				//进行表单检查
				var checkRes = graceChecker.check(_this, loginRule);
				if (checkRes) {
					uni.showToast({
						title: "验证通过!",
						icon: "none"
					});
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					return;
				}

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
.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
