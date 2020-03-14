<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">注册</block>
		</cu-custom>
		<image src="../../static/image/1.jpg" style="height: 190upx;"></image>
<!-- 		<view style="color: #000000;align-content: center; display: flex; width: 100%; justify-content: center; font-size: 50upx; font-weight: 600;" >
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
				<view class="cu-form-group">
					<input type="password" placeholder="请确认密码" name="input" v-model="repassword" style="font-size: 32upx;"></input>
				</view>
			</view>
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg round" @tap="register">注册</button>
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
				userId: "",
				password: "",
				repassword: ""
			}
		},
		methods: {
			register(){
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
					},
					{
						name: 'repassword',
						checkType: 'same',
						checkRule: _this.password,
						errorMsg: '两次输入密码不一致,请检查'
					}
				];
				var checkRes = graceChecker.check(_this, registerRule);
				if (checkRes) {
					uni.request({
					    url: this.Server_IP + 'register', //仅为示例，并非真实接口地址。
					    data: {
					        userId: this.userId,
							password: md5(this.password)
					    },
					    header: {
					        'custom-header': 'register' //自定义请求头信息
					    },
						method:"POST",
						dataType:"json",
					    success: (res) => {
					        console.log(res.data);
							if(res.data.info.code == '0'){
								uni.setStorageSync('userId', res.data.data.userId);
								console.log("成功")
								uni.navigateBack({
								    delta: 1
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
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					_this.isFocus = true;
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
</style>
