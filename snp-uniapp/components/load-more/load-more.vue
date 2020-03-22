<template>
	<view>
		<scroll-view scroll-y style="height: 100%;width: 100%;background-color: #f9fafb;">
			<view class="scroll-items evaluate-box">
				<view class="evaluate-box-header"></view>
				<view class="evaluate-box-body"></view>
				<view  v-for="(pic,idx) in sayList" :key="idx">
					<view>{{pic}}</view>
				</view>
				<view class="flex" style="justify-content: center;" @tap="add">加载更多</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sayList: [1,2,3,4,5]
			}
		},
		name: 'load-more',
		onPullDownRefresh() {
		        console.log('refresh');
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
		},
		methods: {
			add(){
				var num = [1,2,3,4,5,6,7,8,9,0]
				this.sayList = this.sayList.concat(num)
			}
		}
	}
</script>

<style>

</style>
