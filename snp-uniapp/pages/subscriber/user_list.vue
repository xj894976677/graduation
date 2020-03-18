<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{title}}</block>
		</cu-custom>

		<view class="cu-card case" v-for="(item,index) in userList" :key="index">
			<view class="cu-item shadow " @tap="tohomepage(item)">
				<view class="margin flex-sub cu-item self-center  flex" style="align-items: center;">
					<view class="cu-avatar round lg" :style="{backgroundImage:'url(http://a3q.dns06.net.cn/15844990493147.jpeg)'}"></view>
					<view >
						<view class="text-grey margin-left" style="display: inline; font-size: 40upx;">{{item}}</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "",
				userList: ""
			}
		},
		onLoad(object) {
			this.userList = JSON.parse(object.userList)
			this.title = object.title
		},
		methods: {
			tohomepage(userId){
				uni.navigateTo({
					url: '/pages/subscriber/homepage?userId='+userId
				});	
			}
		}
	}
</script>

<style>

</style>
