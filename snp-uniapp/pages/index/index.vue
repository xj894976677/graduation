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
			getLocalTime(nS) { 
			       return  
			},
			suserid(){
				var time = ""
				var data = new Date(parseInt(1584685373492))
				time += data.getFullYear() + "年"
				time += data.getMonth()+1 + "月"
				time += data.getDate() + "日 "
				time += data.getHours()+ ":"
				time += data.getMinutes() + ":"
				time += data.getSeconds()
				console.log(time)
			}
		}
	}
</script>

<style>
page {
		background-color: #f9fafb;
	}
</style>
