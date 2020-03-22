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
						<view  v-for="(pic,idx) in sayList" :key="idx">
							<view>{{pic}}</view>
						</view>
						<view class="flex" style="justify-content: center;" @tap="add">加载更多</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item bg-green">关注</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				sayList: [1,2,3,4,5,6,7,8,9],
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				PageCur: 'basics',
				userIds: '',
				height: '',
				current: 0
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
		},
		onPullDownRefresh() {
		        console.log('refresh');

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
				var num = [1,2,3,4,5,6,7,8,9,0]
				this.sayList = this.sayList.concat(num)
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
