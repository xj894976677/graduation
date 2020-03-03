<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">通过id查询用户名</block>
		</cu-custom>
		<view class="title">{{Username}}</view>
		<view class="cu-form-group">
			<view class="title">验证码</view>
			<input placeholder="输入框带个按钮" name="input" @input="onKeyInput"></input>
			<button class='cu-btn bg-green shadow' @click="tijiao">验证码</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Username: "空",
				Userid: "123"
			}
		},
		methods: {
			tijiao(){
				console.log(this.Userid);
				uni.request({
				    url: 'http://localhost:8181/queryUser1', //仅为示例，并非真实接口地址。
				    data: {
				        userId: "123"
				    },
				    header: {
				        'custom-header': 'hello' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						this.Username = res.data.data.status;
				    }
				});
			},
			onKeyInput(event){
				this.Userid = event.target.value
			}
		}
	}
</script>

<style>

</style>
