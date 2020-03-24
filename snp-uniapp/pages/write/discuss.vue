<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">评论</block>
		</cu-custom>
		<view class="scroll-items evaluate-box">
			<view class="evaluate-box-header"></view>
			<view class="evaluate-box-body"></view>
			<view class="cu-card dynamic" :class="isCard?'no-card':''">
				<view class="cu-item shadow">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
							<view class="content flex-sub">
								<view>{{sayList[index].userName}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{getTimeFormat(sayList[index].moment)}}
								</view>
							</view>
						</view>
					</view>
					<view class="text-content margin-top-sm" style="font-size: 35upx;">
						{{sayList[index].text}}
					</view>
					<view class="grid flex-sub padding-lr margin-top-sm" :class="isCard?'col-3 grid-square':'col-1'">
						<view class="bg-img" :class="isCard?'':'only-img'" :style="[{'background-image':'url('+ pic +')' }]"
						 v-for="(pic,idx) in sayList[index].picUrl" :key="idx" >
						</view>
					</view>
					<view class="text-gray text-sm text-right padding">
						<text class="cuIcon-locationfill margin-lr-xs" style="color: #0081FF;"></text> {{sayList[index].address}}
						<text class="cuIcon-messagefill margin-lr-xs" style="color: #1bb8b8;"></text> {{sayList[index].discuss}}
						<text @tap="Thumb()" class="cuIcon-appreciatefill margin-lr-xs" :style="{'color': sayList[index].isThumb=='1'?isthumbColor:ThumbColor}"></text> {{sayList[index].thumb}}
					</view>
				</view>
			</view>
		</view>
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon"></text>
				<input :adjust-position="true" v-model="discuss" type="text" placeholder="编辑评论" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur round" @tap="todiscuss">评论</button>
			</view>
		</view>
		<view class="cu-list menu-avatar comment solids-top" style="margin-top: auto;" v-for="(discusstemp, idx) in discussList" :key="idx">
			<view class="cu-item">
				<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png);"></view>
				<view class="content">
					<view class="text-grey">{{discusstemp.userName}}</view>
					<view class="text-gray text-content text-df">
						{{discusstemp.discuss}}
					</view>
					<view class="margin-top-sm flex justify-between">
						<view class="text-gray text-df">{{getTimeFormat(discusstemp.moment)}}</view>
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
				isCard: true,
				sayList: null,
				index: '',
				isthumbColor: "#ff5500",
				discussList: [],
				discuss: ""
			}
		},
		onLoad(e) {
			this.sayList = uni.getStorageSync('sayList')
			this.index = e.index
			console.log(this.sayList[e.index].picUrl)
			
			uni.request({
			    url: this.Server_IP + 'queryDiscuss', //仅为示例，并非真实接口地址。
			    data: {
					textId: this.sayList[this.index].textId
			    },
			    header: {
			        'custom-header': 'queryDiscuss' //自定义请求头信息
			    },
				method:"POST",
				dataType:"json",
			    success: (res) => {
			        console.log(res.data);
					if(res.data.info.code == '0'){
						this.discussList = JSON.parse(res.data.data.discuss)
					}else{
						uni.showToast({
							icon: 'none',
							title: "获取评论失败"
						});
					}
			    },
			});
		},
		methods: {
			ipreviewImage(idx, picUrl) {
				console.log("11")
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
			Thumb(){
				if(this.sayList[this.index].isThumb == "0"){
					this.addThumb()
				}else{
					this.delThumb()
				}
			},
			addThumb(){
				console.log("点赞")
				
				uni.request({
				    url: this.Server_IP + 'addThumb', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						textId: this.sayList[this.index].textId
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
							this.sayList[this.index].thumb = +this.sayList[this.index].thumb + 1
							this.sayList[this.index].isThumb = "1"
							
							uni.setStorageSync("sayList", this.sayList)
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
						textId: this.sayList[this.index].textId
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
							this.sayList[this.index].thumb = +this.sayList[this.index].thumb - 1
							this.sayList[this.index].isThumb = "0"
							uni.setStorageSync("sayList", this.sayList)
						}else{
							uni.showToast({
								icon: 'none',
								title: "取消失败"
							});
						}
				    },
				});
			},
			todiscuss(){
				console.log(this.discuss)
				uni.request({
				    url: this.Server_IP + 'addDiscuss', //仅为示例，并非真实接口地址。
				    data: {
						userId: this.sayList[this.index].userId,
						textId: this.sayList[this.index].textId,
						sayUserId: uni.getStorageSync('userId'),
						discuss: this.discuss,
				    },
				    header: {
				        'custom-header': 'addDiscuss' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							uni.showToast({
								icon: 'none',
								title: "评论成功"
							});
							this.sayList[this.index].discuss = +this.sayList[this.index].discuss + 1
							var discusstemp = {
								userId: this.sayList[this.index].userId,
								textId: this.sayList[this.index].textId,
								sayUserId: uni.getStorageSync('userId'),
								discuss: this.discuss,
								moment: (new Date()).getTime()
							}
							this.discussList.splice(0,0,discusstemp)
							this.discuss = ""
							uni.setStorageSync("sayList", this.sayList)
						}else{
							uni.showToast({
								icon: 'none',
								title: "评论失败"
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
