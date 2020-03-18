<template>
	<view class="index-page">
		<view></view>
		<sunui-upimg @change="getImageInfo1" :upload_auto="true" ref="upimg1" :upload_count="1"></sunui-upimg>
		<sunui-upimg @change="getImageInfo2" :upload_auto="true" ref="upimg2" :upimg_preview="serviceArr2" :upload_count="3"></sunui-upimg>
		<!-- 可能有的时候只是从服务器获取图片，禁用删除图片! -->
		<sunui-upimg @change="getImageInfo3" :upload_auto="true" :upimg_preview="serviceArr3" :upimg_move="false" ref="upimg3"></sunui-upimg>
		<sunui-upimg @change="getImageInfo4" :upload_auto="true" ref="upimg4" :upimg_preview="serviceArr4"></sunui-upimg>
	</view>
</template>

<script>
	import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
	export default {
		data() {
			return {
				serviceArr2: [],
				serviceArr3: [{
					path: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=1537304011,3995405403&fm=74&app=80&f=JPEG&size=f121,140?sec=1880279984&t=97b7ba208086526f1a92f5294f1a68a3'
				}],
				serviceArr4: [{
						path: 'https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=1537304011,3995405403&fm=74&app=80&f=JPEG&size=f121,140?sec=1880279984&t=97b7ba208086526f1a92f5294f1a68a3'
					},
					{
						path: 'https://dss0.baidu.com/73t1bjeh1BF3odCf/it/u=63785387,1979900985&fm=85&s=8015CD304A92909C8F80B180030030EB'
					}
				]
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
			async getInfo() {
				await uni.request({
					url: 'http://www.pbdpw.com/info.php',
					method: 'GET',
					data: {},
					success: res => {
						if (res.data.status == 'ok') {
							this.serviceArr2 = res.data.data;
							console.log('服务器返回值：', JSON.stringify(res.data.data))
						}
					}
				});
			},
			getImageInfo1(e) {
				console.log('图片返回1：', e)
			},
			getImageInfo2(e) {
				console.log('图片返回2：', e)
			},
			getImageInfo3(e) {
				console.log('图片返回3：', e)
			},
			getImageInfo4(e) {
				console.log('图片返回4：', e)
			}
		}
	}
</script>

<style>
</style>
