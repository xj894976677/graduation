<template>
	<view>
		<view class="cu-custom bg-gradual-blue" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar-temp" :style="style" style="font-size: 35upx;">
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<view class="flex " style="align-items: center; justify-content: center;">
						<view style="" @tap="recommend" :style="{color: current==0?'#fffc99':'balck'}">推荐</view>
						<view style=" margin-left: 80upx;" @tap="follow" :style="{color: current==1?'#fffc99':'balck'}">关注</view>
					</view>
				</view>
			</view>
		</view>
		 <swiper @change="change" :style="{height: height-50-StatusBar + 'px'}" :current = current>
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;background-color: #f9fafb;">
					<view class="scroll-items evaluate-box">
						<view class="evaluate-box-header"></view>
						<view class="evaluate-box-body"></view>
						<view class="cu-card dynamic margin-top" :class="isCard?'no-card':''" v-for="(item,index) in recommendList" :key="index">
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
									<text class="cuIcon-messagefill margin-lr-xs" style="color: #1bb8b8;" @tap="Rtodiscuss(index)"></text> {{item.discuss}}
									<text @tap="RThumb(index)" class="cuIcon-appreciatefill margin-lr-xs" :style="{'color': item.isThumb=='1'?isthumbColor:ThumbColor}"></text> {{item.thumb}}
								</view>
							</view>
						</view>
						<view class="flex margin-top margin-bottom" style="justify-content: center; color: #0081FF;" @tap="Radd">{{Rloadname}}</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y style="height: 100%;width: 100%;background-color: #f9fafb;">
					<view class="scroll-items evaluate-box">
						<view class="evaluate-box-header"></view>
						<view class="evaluate-box-body"></view>
						<view class="cu-card dynamic margin-top" :class="isCard?'no-card':''" v-for="(item,index) in sayList" :key="index">
							<view class="cu-item shadow">
								<view class="cu-list menu-avatar" @tap="tohomepage(item.userId)">
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
									<text class="cuIcon-messagefill margin-lr-xs" style="color: #1bb8b8;" @tap="todiscuss(index)"></text> {{item.discuss}}
									<text @tap="Thumb(index)" class="cuIcon-appreciatefill margin-lr-xs" :style="{'color': item.isThumb=='1'?isthumbColor:ThumbColor}"></text> {{item.thumb}}
								</view>
							</view>
						</view>
						<view class="flex margin-top margin-bottom" style="justify-content: center; color: #0081FF;" @tap="add">{{loadname}}</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				isLogin: false,
				loadname: "加载更多",
				Rloadname: "加载更多",
				isCard: true,
				sayList: null,
				isthumbColor: "#ff5500",
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				PageCur: 'basics',
				userIds: '',
				height: '',
				current: 0,
				Fstart: 3,
				Rstart: 0,
				pagesize: 3,
				recommendList: null
			}
		},
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				return style
			}
		},
		onLoad() {
			let _this = this
			uni.getSystemInfo({
			    success: function (res) {
					_this.height = res.windowHeight
			    }
			});
			console.log(this.height)
			if(uni.getStorageSync('isLogin') == true){
				uni.request({
				    url: this.Server_IP + 'recommendS', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId')
				    },
				    header: {
				        'custom-header': 'recommendS' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log("获取推荐微博第一页成功");
						console.log(res)
						if(res.data.info.code == '0'){
							if(res.data.data.sayList == ""){
								var sayList = []
							}else{
								var sayList = JSON.parse(res.data.data.recommend)
								for(var index = 0; index < sayList.length; index++){
									var url = sayList[index].picUrl
									sayList[index].picUrl = JSON.parse(url)
								}								
							}
							this.recommendList = sayList
							uni.setStorageSync("recommendList", this.recommendList)
						}else{
						}
				    },
				});
			}else{
				uni.request({
				    url: this.Server_IP + 'recommend', //仅为示例，并非真实接口地址。
				    data: {
						start: 0,
						pagesize: 3
				    },
				    header: {
				        'custom-header': 'recommend' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log("获取推荐微博第一页成功");
						console.log(res)
						if(res.data.info.code == '0'){
							if(res.data.data.sayList == ""){
								var sayList = []
							}else{
								var sayList = JSON.parse(res.data.data.recommend)
								for(var index = 0; index < sayList.length; index++){
									var url = sayList[index].picUrl
									sayList[index].picUrl = JSON.parse(url)
								}								
							}
							this.recommendList = sayList
							uni.setStorageSync('recommendList', sayList);
							uni.setStorageSync('Rstart', 3);
							this.Rstart = 3
						}else{
						}
				    },
				});
			}
		},
		onPullDownRefresh() {
			if(this.current == 1){
				console.log('refresh关注');
				uni.request({
				    url: this.Server_IP + 'followsay', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						start: 0,
						pagesize: 3
				    },
				    header: {
				        'custom-header': 'followsay' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log("获取关注用户微博第一页成功");
						if(res.data.info.code == '0'){
							if(res.data.data.sayList == ""){
								var sayList = []
								uni.showToast({
									title: "您还未关注任何用户",
									icon: "none"
								});
								this.loadname = "没有更多了,请尝试刷新吧"
							}else{
								var sayList = JSON.parse(res.data.data.sayList)
								for(var index = 0; index < sayList.length; index++){
									var url = sayList[index].picUrl
									sayList[index].picUrl = JSON.parse(url)
								}
								this.loadname = "加载更多"
							}
							uni.setStorageSync('sayList', sayList);
							this.sayList = sayList
							this.Fstart = 3;
							console.log("sayList" + this.sayList)
							console.log("Fstart" + this.Fstart)
							uni.setStorageSync('Fstart', 3);
							
							setTimeout(function () {
							    uni.stopPullDownRefresh();
							}, 1000);
						}else{
						}
				    },
				});
			}else{
				if(uni.getStorageSync('isLogin')==true){
					uni.request({
					    url: this.Server_IP + 'recommendS', //仅为示例，并非真实接口地址。
					    data: {
							userId: uni.getStorageSync('userId')
					    },
					    header: {
					        'custom-header': 'recommendS' //自定义请求头信息
					    },
						method:"POST",
						dataType:"json",
					    success: (res) => {
					        console.log("获取推荐微博第一页成功");
							console.log(res)
							if(res.data.info.code == '0'){
								if(res.data.data.sayList == ""){
									var sayList = []
								}else{
									var sayList = JSON.parse(res.data.data.recommend)
									for(var index = 0; index < sayList.length; index++){
										var url = sayList[index].picUrl
										sayList[index].picUrl = JSON.parse(url)
									}								
								}
								this.recommendList = sayList
								uni.setStorageSync('recommendList', sayList);
								setTimeout(function () {
								    uni.stopPullDownRefresh();
								}, 1000);
							}else{
							}
					    },
					});
				}else{
					uni.request({
					    url: this.Server_IP + 'recommend', //仅为示例，并非真实接口地址。
					    data: {
							start: 0,
							pagesize: 3
					    },
					    header: {
					        'custom-header': 'recommend' //自定义请求头信息
					    },
						method:"POST",
						dataType:"json",
					    success: (res) => {
					        console.log("获取推荐微博第一页成功");
							console.log(res)
							if(res.data.info.code == '0'){
								if(res.data.data.sayList == ""){
									var sayList = []
								}else{
									var sayList = JSON.parse(res.data.data.recommend)
									for(var index = 0; index < sayList.length; index++){
										var url = sayList[index].picUrl
										sayList[index].picUrl = JSON.parse(url)
									}								
								}
								this.recommendList = sayList
								uni.setStorageSync('recommendList', sayList);
								uni.setStorageSync('Rstart', 3);
								this.Rstart = 3
							}else{
							}
					    },
					});
				}
				
			}
			
		},
		onShow() {
			console.log("islogin")
			console.log(uni.getStorageSync('isLogin')==true)
			this.loadname = "请登录再查看关注用户微博"
			
			this.sayList = uni.getStorageSync('sayList');
			this.recommendList = uni.getStorageSync('recommendList');
			if(uni.getStorageSync('isLogin') != true){
				this.sayList = null
				this.Fstart = 3
			}else{
				console.log("Fstart"+uni.getStorageSync('Fstart'))
				this.Fstart = uni.getStorageSync('Fstart')
			}
			console.log("sayList" + this.sayList)
			console.log("1")
			try {
			    this.userIds = uni.getStorageSync('userId');
			} catch (e) {
			    // error
			}
			console.log(this.userIds)
			console.log(this.sayList.length < this.pagesize)
			if(this.sayList.length < this.pagesize){
				console.log(this.sayList.length)
				console.log(this.pagesize)
				this.loadname = "没有更多了,请尝试刷新吧"
			}else{
				this.loadname = "加载更多"
			}
		},
		methods: {
			previewImage(idx, picUrl) {
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
			change(e){
				this.current = e.detail.current
			},
			recommend(){
				this.current = 0
				console.log(this.scroll_left)
			},
			follow(){
				this.current = 1
				console.log(this.scroll_left)
			},
			add(){
				var tempSayList = null
				if(this.loadname == "没有更多了,请尝试刷新吧"){
					return;
				}
				uni.request({
				    url: this.Server_IP + 'followsay', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						start: this.Fstart,
						pagesize: this.pagesize
				    },
				    header: {
				        'custom-header': 'followsay' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							this.Fstart += this.pagesize
							uni.setStorageSync('Fstart', this.Fstart);
							tempSayList = JSON.parse(res.data.data.sayList)
							for(var index = 0; index < tempSayList.length; index++){
								var url = tempSayList[index].picUrl
								tempSayList[index].picUrl = JSON.parse(url)
							}
							if(tempSayList.length < this.pagesize){
								this.loadname = "没有更多了,请尝试刷新吧"
							}
							console.log(tempSayList)
							this.sayList = this.sayList.concat(tempSayList)
							uni.setStorageSync("sayList", this.sayList)
							console.log(this.sayList)
						}else{
						}
				    },
				});
			},
			Radd(){
				if(uni.getStorageSync('isLogin') == true){
					if(this.Rloadname == "没有更多了,请尝试刷新吧"){
						return;
					}
					uni.request({
					    url: this.Server_IP + 'recommendS', //仅为示例，并非真实接口地址。
					    data: {
							userId: uni.getStorageSync('userId')
					    },
					    header: {
					        'custom-header': 'recommendS' //自定义请求头信息
					    },
						method:"POST",
						dataType:"json",
					    success: (res) => {
					        console.log("获取推荐微博第一页成功");
							console.log(res)
							if(res.data.info.code == '0'){
								if(res.data.data.sayList == ""){
									var sayList = []
								}else{
									var sayList = JSON.parse(res.data.data.recommend)
									for(var index = 0; index < sayList.length; index++){
										var url = sayList[index].picUrl
										sayList[index].picUrl = JSON.parse(url)
									}								
								}
								if(sayList.length <= 0){
									this.Rloadname = "没有更多的推荐了，尝试发表些吧"
								}
								this.recommendList = this.recommendList.concat(sayList)
								uni.setStorageSync("recommendList", this.recommendList)
							}else{
							}
					    },
					});
				}else{
					if(this.Rloadname == "没有更多了,请尝试刷新吧"){
						return;
					}
					var tempSayList = null
					uni.request({
					    url: this.Server_IP + 'recommend', //仅为示例，并非真实接口地址。
					    data: {
							userId: uni.getStorageSync('userId'),
							start: this.Rstart,
							pagesize: this.pagesize
					    },
					    header: {
					        'custom-header': 'recommend' //自定义请求头信息
					    },
						method:"POST",
						dataType:"json",
					    success: (res) => {
					        console.log(res.data);
							if(res.data.info.code == '0'){
								this.Rstart += this.pagesize
								uni.setStorageSync('Rstart', this.Rstart);
								console.log(res)
								tempSayList = JSON.parse(res.data.data.recommend)
								for(var index = 0; index < tempSayList.length; index++){
									var url = tempSayList[index].picUrl
									tempSayList[index].picUrl = JSON.parse(url)
								}
								if(tempSayList.length < this.pagesize){
									this.Rloadname = "没有更多了,请尝试刷新吧"
								}
								console.log(tempSayList)
								this.recommendList = this.recommendList.concat(tempSayList)
								uni.setStorageSync("recommendList", this.recommendList)
								console.log(this.recommendList)
							}else{
							}
					    },
					});
				}
				
				
			},
			
			Thumb(index){
				if(uni.getStorageSync('isLogin') == true){
					if(this.sayList[index].isThumb == "0"){
						this.addThumb(index)
					}else{
						this.delThumb(index)
					}
				}else{
					uni.showToast({
						icon: 'none',
						title: "请先登录"
					});
				}
			},
			RThumb(index){
				if(uni.getStorageSync('isLogin') == true){
					if(this.recommendList[index].isThumb == "0"){
						this.RaddThumb(index)
					}else{
						this.RdelThumb(index)
					}
				}else{
					uni.showToast({
						icon: 'none',
						title: "请先登录"
					});
				}
			},
			RaddThumb(index){
				console.log("点赞")
				
				uni.request({
				    url: this.Server_IP + 'addThumb', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						textId: this.recommendList[index].textId
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
							this.recommendList[index].thumb = +this.recommendList[index].thumb + 1
							this.recommendList[index].isThumb = "1"
							uni.setStorageSync("recommendList", this.recommendList)
						}else{
							uni.showToast({
								icon: 'none',
								title: "点赞失败"
							});
						}
				    },
				});
			},
			RdelThumb(index){
				console.log("取消点赞")
				
				uni.request({
				    url: this.Server_IP + 'delThumb', //仅为示例，并非真实接口地址。
				    data: {
						userId: uni.getStorageSync('userId'),
						textId: this.recommendList[index].textId
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
							this.recommendList[index].thumb = +this.recommendList[index].thumb - 1
							this.recommendList[index].isThumb = "0"
							uni.setStorageSync("recommendList", this.recommendList)
						}else{
							uni.showToast({
								icon: 'none',
								title: "取消失败"
							});
						}
				    },
				});
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
			tohomepage(userId){
				console.log(userId)
				uni.navigateTo({
					url: '/pages/subscriber/homepage?userId='+userId
				});	
			},
			todiscuss(index){
				console.log(this.sayList[index])
				uni.navigateTo({
					url: '/pages/write/discuss?index='+ index
				});	
			},
			Rtodiscuss(index){
				if(uni.getStorageSync('isLogin') == true){
					uni.navigateTo({
						url: '/pages/write/login_discuss?index='+ index
					});	
				}else{
					uni.navigateTo({
						url: '/pages/write/notLoginDiscuss?index=' + index
					});	
				}
				
			}
		}
	}
</script>

<style>
page {
		background-color: #f9fafb;
	}
.cu-custom-temp {
	display: block;
	position: relative;
}
.cu-bar-temp {
	display: flex;
	align-items: center;
	min-height: 100upx;
	justify-content: center;
}

</style>
