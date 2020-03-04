<template>
	<view>
		<cu-custom bgColor="bg-gradual-orange">
			<block slot="content">首页</block>
		</cu-custom>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				PageCur: 'basics'
			}
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			}
		}
	}
</script>

<style>

</style>
