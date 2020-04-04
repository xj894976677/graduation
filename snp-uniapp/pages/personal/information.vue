<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">个人信息</block>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">昵称</view>
				<view>
					{{userName}}
				</view>
				
			</view>
			<view class="cu-form-group">
				<view class="title">简介</view>
				<view>
					{{synopsis}}
				</view>
				
			</view>
			
			<view class="cu-form-group">
				<view class="title">性别</view>
				<view>
					{{sexIndex!=""?sex[sexIndex]:'未设置'}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">生日</view>
				<view>
					{{birthday}}
				</view>

			</view>
			<view class="cu-form-group">
				<view class="title">手机</view>
				<view>
					{{telephone}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">爱好</view>
				<view>
					{{fieldStr}}
				</view>
			</view>

			
			<view class="cu-form-group">
				<view class="title">邮箱</view>
				<input placeholder="请设置邮箱" name="input" v-model="mail" disabled="true"></input>
				<button class='cu-btn bg-blue' @tap="changemail">{{captchaName}}</button>
			</view>

			
			
			<view class="padding flex margin-top" style="justify-content: space-between;">
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="Cancellation">注销</button>
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="change">修改信息</button>
			</view>
			<view class="padding flex flex-direction margin-top window-bottom">
				
			</view>
		</form>
		
	</view>
</template>

<script>
	import util from '@/common/util.js'
	import graceChecker from '@/common/graceChecker.js'
	export default {
		data() {
			return {
				userId: '',
				modalName: null,
				userName: '',
				fieldStr: '',
				mail: '',
				birthday: '1990-01-01',
				telephone: '',
				synopsis: '',
				sex: ['女', '男'],
				sexIndex: -1,
				captcha: '',
				captchaName: "修改邮箱",
				field: '',
				fieldbox: '',
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
			};
		},
		onShow(e) {
			console.log("加载信息界面")
			let _this = this;
			_this.userId = uni.getStorageSync('userId')
			console.log(_this.userId)
			_this.userName = uni.getStorageSync('userName')
			_this.mail = uni.getStorageSync('mail')
			_this.birthday = uni.getStorageSync('birthday')
			_this.telephone = uni.getStorageSync('telephone')
			_this.synopsis = uni.getStorageSync('synopsis')
			_this.field = uni.getStorageSync('field')
			_this.sexIndex = uni.getStorageSync('sex')
			console.log(_this.sexIndex=="")
			console.log("sexIndex"+_this.sexIndex)
			if(_this.mail == ""){
				_this.captchaName = "设置邮箱"
			}
			if(_this.field.funny == 1){
				_this.checkbox[0].checked = 1
				_this.fieldStr = "娱乐"
			}
			if(_this.field.anime == 1){
				_this.checkbox[1].checked = 1
				if(_this.fieldStr == ''){
					_this.fieldStr = "动漫"
				}else{
					_this.fieldStr += ",动漫"
				}
			}
			if(_this.field.news == 1){
				_this.checkbox[2].checked = 1
				if(_this.fieldStr == ''){
					_this.fieldStr = "新闻"
				}else{
					_this.fieldStr += ",新闻"
				}
			}
			if(_this.field.fashion == 1){
				_this.checkbox[3].checked = 1
				if(_this.fieldStr == ''){
					_this.fieldStr = "时尚"
				}else{
					_this.fieldStr += ",时尚"
				}
			}
			if(_this.field.motion == 1){
				_this.checkbox[4].checked = 1
				if(_this.fieldStr == ''){
					_this.fieldStr = "运动"
				}else{
					_this.fieldStr += ",运动"
				}
			}
			if(_this.field.science == 1){
				_this.checkbox[5].checked = 1
				if(_this.fieldStr == ''){
					_this.fieldStr = "科技"
				}else{
					_this.fieldStr += ",科技"
				}
			}
			if(_this.fieldStr.length > 9){
				var result = _this.fieldStr.substr(0,8)
				result += "  ..."
				_this.fieldStr = result
			}
			console.log(_this.fieldStr)
			_this.fieldbox = checkbox
			
			if(_this.mail == ''){
				_this.captchaName = "绑定邮箱"
			}

		},
		methods: {
			ChooseCheckbox(e) {
				let temp = '';
				let items = this.checkbox;
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						if(items[i].checked == 1){
							items[i].checked = 0
						}else{
							items[i].checked = 1
						}
						break
					}
				}
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if(items[i].checked == 1){
						if(temp == ''){
							temp = items[i].name;
						}else{
							temp += ','+items[i].name;
						}
					}
				}
				if(temp.length > 9){
					var result = temp.substr(0,8)
					result += "  ..."
					temp = result
				}
				this.fieldStr = temp
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			sexChange(e) {
				this.sexIndex = e.detail.value
			},
			DateChange(e) {
				this.birthday = e.detail.value
			},
			// 跳转到修改邮箱页面
			changemail() {
				if(this.mail == ""){
					uni.navigateTo({
					    url: './bandmail'
					});
				}else{
					uni.navigateTo({
					    url: './changemail?mail='+this.mail
					});
				}
			},
			change() {
				uni.navigateTo({
					url: '/pages/personal/change_information'
				});		
			},
			Cancellation(){
				try {
				    uni.clearStorageSync();
					uni.setStorageSync('isLogin', false);
					let promise = this.tim.logout();
					promise.then(res=> {
						this.$store.commit('reset')
						uni.switchTab({
							url: '/pages/index/index'
						});
						uni.showToast({
							icon: 'none',
							title: "已注销"
						});
					}).catch(err=> {
					   console.log('退出失败')
					});
				} catch (e) {
				    // error
				}
			}
		}
	}
</script>

<style>
page{
	background-color: #FFFFFF;
	height: 80%;
	display: flex;
	flex-direction: column;
	justify-content: center;

}
.container{
		/* 定义flex容器 */
		display: flex;
         /*设置容器内部容器的排列方向*/	
		height: 100%;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		
	}
.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
.window-bottom{
		position: fixed;  
		bottom: var(--window-bottom);
	}
</style>
