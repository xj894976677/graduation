<template>
	<view>
		
		<view   @touchstart="test.touchstart" @touchmove="test.touchmove" 
		:change:prop="test.end" :prop="propValue"
		@touchend="test.touchend" :data-top="scrollTop" id="refresh-container"  >
		
		<!-- 起始会隐藏在导航栏里 -->
		<view class="flex-row-center" :style="{height:heightRh,width: '750rpx'}">
			<image :src="image" mode="aspectFit" :style="{width:widthImg}" id="lot" ></image>
			<text v-show="msgShow" style="color: #93c6ad;font-size: 20rpx;padding-left: 20rpx;">{{refreshText}}</text>
		</view>
			<!-- 后续内容 -->
			<slot ></slot>
			
		</view>
	</view>
</template>

<script module="test" lang="wxs">
	// 起始y的坐标
    var startY = 0
	// y轴移动距离
	var top=0
	// 防止重复下拉刷新
	var code=0
	// 防止重复向逻辑层交互
	var mit=0
    function touchstart(event, ins) {
        if(code==0){
			mit=0
			ins.callMethod('refresh',2);
			var touch = event.touches[0] || event.changedTouches[0]
			startY = touch.pageY
        } 
    }
	function end(newValue, oldValue, ownerInstance, instance) {
		// 收回
		ownerInstance.selectComponent('#refresh-container').setStyle({
			'transform': 'translateY(0)',
			'transition': 'ease 0.3s'
		})
		// 停止转圈
		 ownerInstance.selectComponent('#lot').removeClass('turn-load')
		// 复原
		code=0
	}
	function touchend(event, ins) {
	  if(code==0){
		  // 这里根据自己业务处理,小于60则不作操作
		  if(top<60){
			  ins.selectComponent('#refresh-container').setStyle({
				'transform': 'translateY(0)',
				'transition': 'ease 0.3s'
			  })
		  }else{
			  //复原
			  top=0
			  // 改变提示文字
			  ins.callMethod('refresh',1);
			  // 防止重复下拉
			  code=1			 
			  ins.selectComponent('#refresh-container').setStyle({
				  // 成功刷新回弹的距离
				'transform': 'translateY(60px)',
				'transition': 'ease 0.3s'
			  })		
			   // 可以替换旋转速率
				// ins.selectComponent('#lot').setStyle({
				// 	'transform': 'rotate(0)',
				// 	'transition': 'ease 3s'
				// })
			  ins.selectComponent('#lot').addClass('turn-load')

		  }
	    }
	}
    function touchmove(event, ins) {
	  if(code==0){	
		  var touch = event.touches[0] || event.changedTouches[0]
		  var pageY = touch.pageY
		  var vew=ins.selectComponent('#refresh-container')
		  var dataset = vew.getDataset();
		  top = pageY - startY
		  // 页面是否触底
		  if(dataset.top==0){
			  // 改变提示文字,且只会触发一次
			  if(top>60){
				  if(mit==0){
					ins.callMethod('refresh',0);
				  }
				  mit=1				  
			  }
			  vew.setStyle({
				'transform': 'translateY(' + (top) + 'px)'
			  })	  
			  ins.selectComponent('#lot').setStyle({
				'transform': 'rotate(' + (top*6) + 'deg)'
			  })
		  }else{
			  // 从长列表下拉上来 ,这里要实时更新起始位置
			  startY=pageY
		  }
		}
    }
    module.exports = {
	  end:end,
      touchend: touchend,
      touchstart: touchstart,
      touchmove: touchmove
    }
</script>

<script>
	
	export default {
		name:"refresh",
		props:{
			widthImg:{
				type:String,
				default:"40rpx"
			},
			heightRh:{
				type:String,
				default:"70rpx"
			},
			msgShow:{
				type:Boolean,
				default:true
			},
			image:{
				type:String,
				default:"../../static/lt1.png"
			}
				
		},	
		created() {
		   uni.$on('reMsg',(data)=>{
				if(data==-1){
					this.propValue=!this.propValue
				}else{
					this.scrollTop=data
				}
			})
		},
		data() {
			return {
				refreshText:"下拉刷新",
				scrollTop:0,
				propValue:true,
			}
		},
		methods: {
			refresh(i){
				if(i==0){
					this.refreshText="松开刷新"
				}else if(i==1){
					// 这里写刷新业务
					this.refreshText="正在刷新"
					this.$emit('down',1)
				}else if(i==2){
					this.refreshText="下拉刷新"
				}
			}
		}
	}
</script>
<style>
 .flex-row-center{
		 display: flex;
		 flex-direction: row;
		 justify-content: center;
		 align-items: center;
	 }
/* 转圈动画 */
.turn-load{
  animation:turnmy 0.6s linear infinite;      
}
@keyframes turnmy{
  from{transform:rotate(0deg);}
  to{transform:rotate(360deg);}
}
</style>
