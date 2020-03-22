<template>
    <view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">我</block>
		</cu-custom>
        <scroll-view style="height: 300px;" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
            :refresher-threshold="100" refresher-background="lightgreen" @refresherpulling="onPulling"
            @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort">
			<view  v-for="(pic,idx) in 100" :key="idx">
				<view>{{pic}}</view>
			</view>
		</scroll-view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                triggered: false
            }
        },
        onLoad() {
			console.log("1")
            this._freshing = false;
            setTimeout(() => {
                this.triggered = true;
            }, 1000)
        },
		onPullDownRefresh(){
					console.log('刷新中');
					setTimeout(function(){
						uni.stopPullDownRefresh();
						console.log("OK了")
					},2000)
				},
        methods: {
            onPulling(e) {
                console.log("onpulling", e);
            },
            onRefresh() {
                if (this._freshing) return;
                this._freshing = true;
                setTimeout(() => {
                    this.triggered = false;
                    this._freshing = false;
                }, 3000)
            },
            onRestore() {
                this.triggered = 'restore'; // 需要重置
                console.log("onRestore");
            },
            onAbort() {
                console.log("onAbort");
            }
        }
    }
</script>