<template>
	<view class="container">
		<view style="color: #000000;align-content: center; display: flex; width: 100%; justify-content: center; font-size: 50upx; font-weight: 600;" >
			世界因你而精彩
		</view>
		<view class="cu-card case" :class="isCard?'no-card':''" style="align-items: center; margin-top: 30upx;">
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
				<view style="color: #888888; font-size: 30upx; margin-left: 40upx; margin-top: 16upx;">忘记密码</view>
				<view style="color: #888888; font-size: 30upx; margin-right: 40upx; margin-top: 16upx;">注册账户</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId: "",
				password: ""
			}
		},
		methods: {
			login(){
				uni.request({
				    url: 'http://localhost:8181/login', //仅为示例，并非真实接口地址。
				    data: {
				        userId: this.userId,
						password: this.password
				    },
				    header: {
				        'custom-header': 'login' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							uni.setStorageSync('userId', res.data.data.userId);
							console.log("成功")
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
