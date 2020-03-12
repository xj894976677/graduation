<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">首页</block>
		</cu-custom>
		<button @click="suserid">查看id</button>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				PageCur: 'basics',
				userIds: ''
			}
		},
		onShow() {
			console.log("1")
			try {
			    this.userIds = uni.getStorageSync('userId');
			} catch (e) {
			    // error
			}
			console.log(this.userIds)
			uni.request({
				url: 'http://localhost:8181/userInformation', //仅为示例，并非真实接口地址。
				data: {
					userId: this.userIds
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
					console.log("请求失败")
				}
			});
		},
		methods: {
			suserid(){
				uni.navigateTo({
					url: '/pages/personal/information'
				});
			}
		}
	}
</script>

<style>

</style>
