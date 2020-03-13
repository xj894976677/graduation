<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">重置密码</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<view class="title">账号</view>
				<input placeholder="请输入您的账号" type="number" name="captcha" maxlength="6" v-model="userId"></input>
			</view>
			
			
			<view class="padding flex flex-direction margin-top round">
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="next">下一步</button>
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
				userId: '',
			};
		},

		methods: {
			next() {
				let _this = this
				var codeRule = [
					{
						name: 'userId',
						checkType: 'notnull',
						errorMsg: '请输入账号'
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
					url: 'http://localhost:8181/mailfromUserId', //仅为示例，并非真实接口地址。
					data: {
						userId: this.userId
					},
					header: {
						'custom-header': 'mailcode' //自定义请求头信息
					},
					method:"POST",
					dataType:"json",
					success: (res) => {
						console.log(res.data);
						if(res.data.info.code == '0'){
							uni.navigateTo({
							    url: './verification_mail?mail='+res.data.data.mail+'&userId='+this.userId
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
