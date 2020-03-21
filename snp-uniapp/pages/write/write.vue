<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">写微博</block>
		</cu-custom>
		<view class="cu-form-group" style="background-color: #F9FAFB;">
			<textarea class="textbg" maxlength="254" :disabled="modalName!=null" v-model="text" placeholder="分享新鲜事..." style="height: 350upx; font-size: 31upx;"></textarea>
		</view>
		<sunui-upimg @change="getImageInfo1" :upload_auto="true" ref="upimg1" :upload_count="4"></sunui-upimg>
		<view style="background-color: #F9FAFB;" class="cu-list menu" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
			<view class="cu-item" style="background-color: #F9FAFB;">
				<view class="content padding-tb-sm" style="background-color: #F9FAFB;">
					<view>
						<text style="background-color: #F9FAFB;" class="cuIcon-locationfill text-blue margin-right-xs"></text>是否添加位置</view>
					<view class="text-gray text-sm">
						<text style="background-color: #F9FAFB;" class="margin-right-xs"></text> {{addressshow}}</view>
				</view>
				<view class="action">
					<switch class="switch-sex" @change="SwitchSex" :checked="skin?true:false"></switch>
				</view>
			</view>
		</view>
		<view class="cu-form-group flex" style="background-color: #F9FAFB; align-items: center;">
			<button class='cu-btn line-cyan round lg' @tap="showModal" data-target="RadioModal">{{fieldStr}}</button>
			<button class='cu-btn bg-blue round shadow lg' @tap="send">发表</button>
		</view>
		<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar" style="display: flex; justify-content: center;">
					<view style="font-size: 40upx; color: #666666;">点击灰色位置返回</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item,sexIndex) in checkbox" class="padding-xs" :key="sexIndex">
						<button class="cu-btn cyan lg block" :class="item.checked==1?'bg-cyan':'line-cyan'" @tap="ChooseCheckbox"
						 :data-value="item.value"> {{item.name}}
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
	import util from '@/common/util.js'
	import graceChecker from '@/common/graceChecker.js'
	export default {
		data() {
			return {
				text: "",
				picUrl: "",
				skin: false,
				addressshow: "点击右侧按钮添加位置",
				address: "",
				fieldStr: "选择类型",
				field: "",
				modalName: null,
				checkbox: [{
					value: 0,
					name: '娱乐',
					alias: 'funny',
					checked: 0,
				}, {
					value: 1,
					name: '动漫',
					alias: 'anime',
					checked: 0,
				}, {
					value: 2,
					name: '新闻',
					alias: 'news',
					checked: 0,
				}, {
					value: 3,
					name: '时尚',
					alias: 'fashion',
					checked: 0,
				}, {
					value: 4,
					name: '运动',
					alias: 'motion',
					checked: 0,
				}, {
					value: 5,
					name: '科技',
					alias: 'science',
					checked: 0,
				}]
			}
		},
		components: {
			'sunui-upimg': sunUiUpimg
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			SwitchSex(e) {
				let _this = this
				if(this.skin == false){
					uni.chooseLocation({
					    success: function (res) {
					        console.log('位置名称：' + res.name);
					        console.log('详细地址：' + res.address);
					        console.log('纬度：' + res.latitude);
					        console.log('经度：' + res.longitude);
							_this.addressshow = res.address
							_this.address = res.address
							_this.skin = e.detail.value
					    },fail() {
							_this.skin = e.detail.value
					    	_this.addressshow = "获取位置失败，请取消并重试"
					    }
					});
				}else{
					_this.skin = e.detail.value
					_this.addressshow = "点击右侧按钮添加位置"
				}
				
			},
			getImageInfo1(e) {
				console.log('图片返回1：', e)
				this.picUrl = e
				console.log(this.picUrl)
			},
			ChooseCheckbox(e) {
				let temp = '';
				let items = this.checkbox;
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						if(items[i].checked == 1){
							this.fieldStr = "选择类型"
							this.field = ""
							items[i].checked = 0
						}else{
							items[i].checked = 1
						}
					}else{
						items[i].checked = 0
					}
				}
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if(items[i].checked == 1){
						this.fieldStr = items[i].name
						this.field = items[i].alias
						break;
					}
				}
			},
			send(){
				let _this = this
				var registerRule = [{
						name: 'text',
						checkType: 'notnull',
						checkRule: '',
						errorMsg: '说些有趣的事情吧'
					},
					{
						name: 'text',
						checkType: 'string',
						checkRule: '0,254',
						errorMsg: '您想说的超过254个字符了哦，删减些吧'
					}
				];
				var checkRes = graceChecker.check(_this, registerRule);
				if(!checkRes){
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}else{
					uni.request({
					    url: this.Server_IP + 'addSay', //仅为示例，并非真实接口地址。
					    data: {
							userId: uni.getStorageSync('userId'),
							text: _this.text,
							address: _this.address,
							field: _this.field,
							picUrl: JSON.stringify(_this.picUrl),
							userName: uni.getStorageSync('userName')
					    },
					    header: {
					        'custom-header': 'addSay' //自定义请求头信息
					    },
						method:"POST",
						dataType:"json",
					    success: (res) => {
					        console.log(res.data);
							if(res.data.info.code == '0'){
								uni.navigateBack({
									delta:1
								})
								uni.showToast({
									title: "发表成功",
									icon: "none"
								});
							}else{
								console.log(res.data.info.message);
								uni.showToast({
									icon: 'none',
									title: res.data.info.message
								});
							}
					    },
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
	.switch-sex::after {
		content: "\e650";
	}

	.switch-sex::before {
		content: "\e651";
	}
	.textbg{
		background-color: #F9FAFB;
	}
</style>
