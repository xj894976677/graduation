<template>
	<view>
		<view>
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">{{title}}</block>
			</cu-custom>
			
			<view class="cu-card dynamic margin-top" :class="isCard?'no-card':''" v-for="(item,index) in sayList" :key="index">
				<view class="cu-item shadow">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
							<view class="content flex-sub">
								<view>{{item.userName}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{getTimeFormat(item.moment)}}
								</view>
							</view>
						</view>
					</view>
					<view class="text-content margin-top-sm" style="font-size: 35upx;">
						{{item.text}}
					</view>
					<view class="grid flex-sub padding-lr margin-top-sm" :class="isCard?'col-3 grid-square':'col-1'">
						<view class="bg-img" :class="isCard?'':'only-img'" :style="[{'background-image':'url('+ pic +')' }]"
						 v-for="(pic,idx) in item.picUrl" :key="idx" @tap="previewImage(idx, item.picUrl)">
						</view>
					</view>
					<view class="text-gray text-sm text-right padding">
						<text class="cuIcon-locationfill margin-lr-xs" style="color: #0081FF;"></text> {{item.address}}
						<text class="cuIcon-messagefill margin-lr-xs" style="color: #1bb8b8;"></text> {{item.discuss}}
						<text @tap="Thumb(index)" class="cuIcon-appreciatefill margin-lr-xs" :style="{'color': item.isThumb=='1'?isthumbColor:ThumbColor}"></text> {{item.thumb}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/common/util.js'
	export default {
		data() {
			return {
				isCard: true,
				title: "",
				isthumbColor: "#ff5500",
				ThumbColor: "",
				sayList: ""
			}
		},
		onLoad(object) {
			this.title = object.title
			this.sayList = JSON.parse(object.sayList)
			console.log(this.sayList)
			console.log(this.sayList[0].moment)
			console.log(JSON.parse(this.sayList[0].picUrl))
			for(var index = 0; index < this.sayList.length; index++){
				var url = this.sayList[index].picUrl
				this.sayList[index].picUrl = JSON.parse(url)
			}
		},
		methods: {
			// 预览图片函数
			previewImage(idx, picUrl) {
				console.log(idx)
				console.log(picUrl)
				let preview = picUrl;
				uni.previewImage({
					current: idx,
					urls: preview
				});
			},
			getTimeFormat(timeStamp){
				var time = ""
				var date = new Date(parseInt(timeStamp))
				time += date.getFullYear() + "年"
				time += date.getMonth()+1 + "月"
				time += date.getDate() + "日 "
				time += date.getHours()+ ":"
				time += date.getMinutes() + ":"
				time += date.getSeconds()
				return time
			},
			isThumb(textId){
				var flag = null
				uni.request({
				    url: this.Server_IP + 'isThumb', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						textId: textId
				    },
				    header: {
				        'custom-header': 'isThumb' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							if(res.data.data.num == '0'){
								flag =  false
							}
						}else{
							flag = false
						}
				    },
				});
				return flag
			},
			Thumb(index){
				if(this.sayList[index].isThumb == "0"){
					this.addThumb(index)
				}else{
					this.delThumb(index)
				}
			},
			addThumb(index){
				console.log("点赞")
				
				uni.request({
				    url: this.Server_IP + 'addThumb', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						textId: this.sayList[index].textId
				    },
				    header: {
				        'custom-header': 'addThumb' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							uni.showToast({
								icon: 'none',
								title: "点赞成功"
							});
							this.sayList[index].thumb = +this.sayList[index].thumb + 1
							this.sayList[index].isThumb = "1"
						}else{
							uni.showToast({
								icon: 'none',
								title: "点赞失败"
							});
						}
				    },
				});
			},
			delThumb(index){
				console.log("取消点赞")
				
				uni.request({
				    url: this.Server_IP + 'delThumb', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						textId: this.sayList[index].textId
				    },
				    header: {
				        'custom-header': 'delThumb' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							uni.showToast({
								icon: 'none',
								title: "取消成功"
							});
							this.sayList[index].thumb = +this.sayList[index].thumb - 1
							this.sayList[index].isThumb = "0"
						}else{
							uni.showToast({
								icon: 'none',
								title: "取消失败"
							});
						}
				    },
				});
			}
		}
	}
</script>

<style>

</style>
