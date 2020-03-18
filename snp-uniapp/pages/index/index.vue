<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">首页</block>
		</cu-custom>
		<button @click="suserid">清除缓存</button>
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
			
		},
		methods: {
			suserid(){
				
				uni.navigateTo({
					url: '/pages/subscriber/homepage?userId=333333'
				});	
			}
		}
	}
</script>

<style>

</style>
