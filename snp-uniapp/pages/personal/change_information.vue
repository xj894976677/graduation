<template>
	<view class="container">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">修改信息</block>
		</cu-custom>
		<form>
			<view class="cu-form-group margin-top">
				<view class="title">昵称</view>
				<input placeholder="请输入用户名" name="input" v-model="userName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">简介</view>
				<input placeholder="请输入您的介绍" name="input" v-model="synopsis"></input>
			</view>
			
			<view class="cu-form-group">
				<view class="title">性别</view>
				<picker @change="sexChange" :value="sexIndex" :range="sex">
					<view class="picker">
						{{sexIndex!=""?sex[sexIndex]:'选择性别'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">生日</view>
				<picker mode="date" :value="date" start="1900-01-01" end="2020-01-01" @change="DateChange">
					<view class="picker">
						{{birthday}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group">
				<view class="title">手机</view>
				<input placeholder="请输入手机号" maxlength="11" v-model="telephone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">爱好</view>
				<input placeholder="请选择您的爱好类型" name="input" v-model="fieldStr" disabled="true"></input>
				<button class='cu-btn bg-blue' @tap="showModal" data-target="RadioModal">修改爱好</button>
			</view>
			<view class="cu-modal" :class="modalName=='RadioModal'?'show':''" @tap="hideModal">
				<view class="cu-dialog" @tap.stop="">
					<view class="cu-bar" style="display: flex; justify-content: center;">
						<view style="font-size: 40upx; color: #666666;">点击灰色位置返回</view>
					</view>
					<view class="grid col-3 padding-sm">
						<view v-for="(item,sexIndex) in checkbox" class="padding-xs" :key="sexIndex">
							<button class="cu-btn orange lg block" :class="item.checked==1?'bg-orange':'line-orange'" @tap="ChooseCheckbox"
							 :data-value="item.value"> {{item.name}}
							</button>
						</view>
					</view>
				</view>
			</view>
			
			<view class="cu-form-group" v-show="false">
				<view class="title">邮箱</view>
				<input placeholder="请设置邮箱" name="input" v-model="mail" disabled="true"></input>
				<button class='cu-btn bg-blue' @tap="changemail">{{captchaName}}</button>
			</view>

			
			
			<view class="padding flex flex-direction margin-top">
				<button class="cu-btn bg-blue lg" data-target="Modal" @tap="change">确认修改</button>
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
				let _this = this;
				// 注册信息校验
				var informationRule = [
					{
						name: 'userName',
						checkType: 'string',
						checkRule: '0,8',
						errorMsg: '昵称过长'
					},
					{
						name: 'synopsis',
						checkType: 'string',
						checkRule: '0,254',
						errorMsg: '简介过长'
					},
					{
						name: 'telephone',
						checkType: 'phoneno',
						checkRule: '',
						errorMsg: '手机号格式不正确'
					}
				];
				//进行表单检查
				var checkRes = graceChecker.check(_this, informationRule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
					return;
				}
				console.log(this.birthday)
				uni.request({
				    url: this.Server_IP + 'changeInformation', //仅为示例，并非真实接口地址。
				    data: {
				        userId: this.userId,
						funny: this.checkbox[0].checked,
						anime: this.checkbox[1].checked,
						news: this.checkbox[2].checked,
						fashion: this.checkbox[3].checked,
						motion: this.checkbox[4].checked,
						science: this.checkbox[5].checked,
						userName: this.userName,
						telephone: this.telephone,
						birthday: this.birthday,
						synopsis: this.synopsis,
						sex: this.sexIndex,
				    },
				    header: {
				        'custom-header': 'changeInformation' //自定义请求头信息
				    },
					method:"POST",
					dataType:"json",
				    success: (res) => {
				        console.log(res.data);
						if(res.data.info.code == '0'){
							uni.setStorageSync('userId', this.userId);
							console.log("成功")
							let temp = this.field
							let items = this.checkbox
							for (let i = 0, lenI = items.length; i < lenI; ++i) {
								temp[items[i].alias] = items[i].checked
							}
							
							uni.setStorageSync('field', temp);
							uni.setStorageSync('userName', this.userName);
							uni.setStorageSync('telephone', this.telephone);
							uni.setStorageSync('sex', this.sexIndex);
							uni.setStorageSync('birthday', this.birthday);
							uni.setStorageSync('synopsis', this.synopsis);
							
							uni.navigateBack({
							    delta: 1
							});
							uni.showToast({
								icon: 'none',
								title: "信息修改成功"
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
</style>
