<template>
	<view class="index-page">
		<view></view>
		<sunui-upimg @change="getImageInfo1" :upload_auto="true" ref="upimg1" :upload_count="6"></sunui-upimg>
	</view>
</template>

<script>
	import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
	export default {
		data() {
			return {
				picUrl: []
			}
		},
		components: {
			'sunui-upimg': sunUiUpimg
		},
		onShow() {

		},
		onLoad() {
			// 数据更新不及时时可以在下次DOM更新时使用
			this.$nextTick(function(){
				this.getInfo();
			})
			// this.getInfo();
		},
		methods: {
			getImageInfo1(e) {
				console.log('图片返回1：', e)
				this.picUrl = e
				console.log(this.picUrl)
			}
		}
	}
</script>

<style>
</style>
