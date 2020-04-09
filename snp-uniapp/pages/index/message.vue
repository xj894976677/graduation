<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">消息</block>
		</cu-custom>
		
		<view class="user-box">
			<view class="nav-tab flex" style="justify-content: space-between;">
				<view>
					<view :class="isActive ==0 ?'tab-item-active tab-item': 'tab-item'" @click="changeTabBtn(0)">聊天记录</view>
					<view :class="isActive ==1 ?'tab-item-active tab-item1': 'tab-item1'" @click="changeTabBtn(1)">关注列表</view>					
					<view class="clear-box"></view>
				</view>
				<view>
					<view class="cu-btn line-cyan round shadow" @tap="toUserList()">相似好友</view>
				</view>
			</view>
		</view>
		<!-- 聊天记录 会话列表 -->
		<view class="conversition-box" v-if="isActive ==0">
			<view class="list-box" v-if="userAddConversationList.length>0">
				<view class="item-box" v-for="(item,index) in userAddConversationList" :key="index" @click="toRoom(item)">
					<view class="item-img">
						<img :src="item.user.headUrl" alt="">
					</view>
					<view class="item-text">
						<view class="item-user">
							{{item.user.userName}}
						</view>
						<view class="item-text-info">
							<rich-text :nodes="nodesFliter(item.conversation.lastMessage.messageForShow)"></rich-text>
							
						</view>
					</view>
					<view class="item-msg">
						<view class="item-msg-icon" v-if="item.conversation.unreadCount">{{item.conversation.unreadCount}}</view>
					</view>
				</view>
			</view>
			<view class="list-box" v-else>
				<span class="msg-box">暂无聊天记录，请选择好友进行聊天</span>
			</view>
		</view>
		<!-- 好友列表 -->
		<view class="user-box" v-if="isActive ==1">
			<view class="list-box">
				<view class="flex" style="align-items: center; height: 100upx; color: #f9fafc; border-bottom: 1px solid #eee; font-size: 40upx;" v-for="(item,index) in friendList" :key="index" @click="checkUserToRoom(item)">
					<view class="user-img">
						<image :src="item.headUrl" alt=""></image>
					</view>
					<view class="user-name">
						{{item.userName}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import userList from '../../commen/tim/user.js'
	import {
		mapState
	} from "vuex";
	export default {
		name: 'record',
		data() {
			return {
				// conversationList: [],
				userList: userList,
				friendList:[],
				isActive: 0, //默认聊天记录
				userAddConversationList:[]
			}
		},
		computed: {
			...mapState({
				isLogin: state => state.isLogin,
				isSDKReady: state => state.isSDKReady,
				conversationList: state => state.conversationList,
			})
		},
		watch: {
			isSDKReady(val) {
				//isSDKReady == true 请求会话列表
				if (val) {
					this.getConversationList()
				}
			},
			conversationList(val){
				this.getUserInfo(val)
				console.log(11111111111111111111111111)
				console.log(this.userAddConversationList)
				console.log(11111111111111111111111111)
			}

		},
		methods: {
			//注销登录
			outLoginBtn(){
				let promise = this.tim.logout();
				promise.then(res=> {
					this.$store.commit('reset')
					uni.reLaunch({
						url: '../index/index'
					})
				}).catch(err=> {
				   console.log('退出失败')
				});
			},
			//聊天的节点加上外层的div
			nodesFliter(str){
				let nodeStr = '<div style="align-items: center;word-wrap:break-word;">'+str+'</div>' 
				return nodeStr
			},
			//切换tab
			changeTabBtn(_index) {
				this.isActive = _index
				if (this.isSDKReady) {
					this.getConversationList()
				}
			},
			//获取消息列表
			getConversationList() {
				// 拉取会话列表
				let promise = this.tim.getConversationList();
				promise.then((res) => {
					console.log("conversationList111111111111111111111111111")
					console.log(res)
					console.log("conversationList111111111111111111111111111111")
					let conversationList = res.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
					if (conversationList.length) {
						//将返回的会话列表拼接上 用户的基本资料  
						//说明：如果已经将用户信息 提交到tim服务端了 就不需要再次拼接
						this.$store.commit("updateConversationList", conversationList);
					}

				}).catch((err) => {
					console.warn('getConversationList error:', err); // 获取会话列表失败的相关信息
				});
			},
			//根据消息列表请求聊天对象的用户信息 并完成数据拼接
			getUserInfo(conversationList) {
				 this.userAddConversationList = []
				conversationList.forEach(item => {
					let obj = {}
					obj.conversation = item
					uni.request({
						url: this.Server_IP + 'userObj', //仅为示例，并非真实接口地址。
						data: {
							userId: item.toAccount
						},
						header: {
							'custom-header': 'userObj' //自定义请求头信息
						},
						method:"POST",
						dataType:"json",
						success: (res) => {
							console.log(res.data);
							if(res.data.info.code == '0'){
								console.log(res)
								console.log(JSON.parse(res.data.data.userObj))
								obj.user = JSON.parse(res.data.data.userObj)
								this.userAddConversationList.push(JSON.parse(JSON.stringify(obj)))
								console.log(this.userAddConversationList)
							}else{
								console.log("获取用户对象失败")
							}
						},
						fail() {
							console.log("获取用户对象失败")
						}
					});
					
				})
			},
			toRoom(item) {
				this.$store.commit('updateConversationActive', item)
				console.log(item)
				uni.request({
					url: this.Server_IP + 'userObj', //仅为示例，并非真实接口地址。
					data: {
						userId: item.user.userId
					},
					header: {
						'custom-header': 'userObj' //自定义请求头信息
					},
					method:"POST",
					dataType:"json",
					success: (res) => {
						console.log(res.data);
						if(res.data.info.code == '0'){
							console.log(res)
							console.log(JSON.parse(res.data.data.userObj))
							uni.setStorageSync("toUserInfo", JSON.parse(res.data.data.userObj))
							uni.navigateTo({
								url: '../chat/room'
							})
						}else{
							console.log("获取用户对象失败")
						}
					},
					fail() {
						console.log("获取用户对象失败")
					}
				});
				
			},
			toUserList(){
				uni.request({
					url: this.Server_IP + 'RecommendedFriend', //仅为示例，并非真实接口地址。
					data: {
						userId: uni.getStorageSync("userId")
					},
					header: {
						'custom-header': 'RecommendedFriend' //自定义请求头信息
					},
					method:"POST",
					dataType:"json",
					success: (res) => {
						console.log(res.data);
						if(res.data.info.code == '0'){
							uni.navigateTo({
								url: '../subscriber/user_list?title=好友推荐&userList='+res.data.data.userList
							})
						}else{
							console.log("获取用户对象失败")
						}
					},
					fail() {
						console.log("获取用户对象失败")
					}
				});
			},
			//选择用户聊天
			checkUserToRoom(toUserInfo) {
				console.log(toUserInfo)
				this.$store.commit('createConversationActive', toUserInfo.userId)
				uni.navigateTo({
					url: '../chat/room'
				})
			}

		},
		onShow() {
			
			if (this.isSDKReady) {
				console.log('2222')
				this.getConversationList()
			}else{
				console.log('333333')
			}
			uni.request({
				url: this.Server_IP + 'queryFollowMessage', //仅为示例，并非真实接口地址。
				data: {
					userId: uni.getStorageSync('userId')
				},
				header: {
					'custom-header': 'queryFollowMessage' //自定义请求头信息
				},
				method:"POST",
				dataType:"json",
				success: (res) => {
					console.log(res.data);
					if(res.data.info.code == '0'){
						console.log(res)
						console.log(JSON.parse(res.data.data.follow))
						this.friendList = JSON.parse(res.data.data.follow)
						uni.setStorageSync('friendList', this.friendList)
					}else{
						console.log("获取关注粉丝失败")
					}
				},
				fail() {
					console.log("获取关注粉丝失败")
				}
			});
		},
		onLoad(){

		}
	}
</script>



<style>
	page {
			background-color: #f9fafb;
		}
	.list-box {
		width: 94%;
		margin: 40rpx auto;
	}

	.item-box {
		width: auto;
		height: 130rpx;
		padding: 20rpx;
		overflow: hidden;
		border-bottom: 1px solid #eee;
	}

	.item-img {
		float: left;
		margin-top: 20rpx;
		width: 80rpx;
		height: 80rpx;
	}

	.item-img img {
		width: 80rpx;
		height: 80rpx;
	}

	.item-text {
		float: left;
		margin-left: 30rpx;
		width: 500rpx;
		height: 100rpx;
		color: #666;
		font-size: 28rpx;
	}

	.item-user {
		width: auto;
		height: 60rpx;
		line-height: 60rpx;
		color: 333;
		font-size: 32rpx;

	}

	.item-text-info {
		width: auto;
		height: 60rpx;
		line-height: 60rpx;
		color: #666;
		font-szie: 24rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-box {
		width: auto;
		height: 100rpx;
		padding: 0 20rpx;
	}

	.nav-tab {
		padding-top: 20rpx;
		height: 80rpx;

	}

	.tab-item {
		float: left;
		height: 70rpx;
		padding: 0 20rpx;
		line-height: 70rpx;
		color: #666;
		font-size: 28rpx;
		border: 1px solid #00aaff;
		border-top-left-radius: 25rpx;
		border-bottom-left-radius: 25rpx;
	}

	.tab-item1 {
		float: left;
		height: 70rpx;
		padding: 0 20rpx;
		line-height: 70rpx;
		color: #666;
		font-size: 28rpx;
		border: 1px solid #00aaff;
		border-top-right-radius: 25rpx;
		border-bottom-right-radius: 25rpx;
	}

	.tab-item-active {
		color: #fff;
		background: #00aaff;
	}

	.msg-box {
		line-height: 30rpx;
		font-size: 28rpx;
		color: #666;
	}

	.user-item-box {
		padding: 20rpx 0;
		width: auto;
		height: 200rpx;
		line-height: 70rpx;
		cursor: pointer;
		border-bottom: 1px solid #eee;
	}

	.user-img {
		float: left;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.user-img image {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}

	.user-name {
		float: left;
		margin-left: 20rpx;
		width: 250rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: #666;
		font-weight: 500;
	}
	.item-msg{
		float: left;
		width: 40rpx;
		height: 100rpx;
	}
	.item-msg-icon{
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background: #f06c7a;
		color: #fff;
		line-height: 40rpx;
		margin-top: 30rpx;
		text-align: center;
		font-size: 24rpx;
	}
	.clear-box {
		clear: both;
	}
	.out-login{
		float: right;
		margin-right:20rpx;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 40rpx;
		border-radius: 25rpx;
		color: #fff;
		background: #F56C6C;
		font-size: 26rpx;
	}
</style>
