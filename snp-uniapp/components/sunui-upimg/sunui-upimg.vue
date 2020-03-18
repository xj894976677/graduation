<template>
	<view class="sunui-uploader-bd">
		<view class="sunui-uploader-files">
			<block v-for="(item, index) in upload_before_list" :key="index">
				<view class="sunui-uploader-file" :class="[item.upload_percent < 100 ? 'sunui-uploader-file-status' : '']" @click="previewImage(index)">
					<!-- step1.这里修改服务器返回字段 ！！！ -->
					<image class="sunui-uploader-img" :style="upload_img_wh" :src="item.path" mode="aspectFill" />
					<view class="sunui-img-removeicon right" @click.stop="removeImage(index)" v-show="upimg_move">×</view>
					<view class="sunui-loader-filecontent" v-if="item.upload_percent < 100">{{ item.upload_percent }}%</view>
				</view>
			</block>
			<view v-show="upload_len < upload_count" hover-class="sunui-uploader-hover" class="sunui-uploader-inputbox" @click="chooseImage" :style="upload_img_wh">
				<view><text class="iconfont icon-mn_shangchuantupian" style="color: #666;"></text></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			upload_len: 0,
			upload_cache: [],
			upload_cache_list: [],
			upload_before_list: []
		};
	},
	name: 'sunui-upimg',
	props: {
		// 服务器url
		url: {
			type: String,
			default: 'https://a3.dns06.net.cn/app/index.php?i=2&c=entry&a=wxapp&do=Upload_qiniu_b&m=jzwx_a'
		},
		// 上传样式宽高
		upload_img_wh: {
			type: String,
			default: 'width:162rpx;height:162rpx;'
		},
		// 上传数量
		upload_count: {
			type: [Number, String],
			default: 9
		},
		// 是否自动上传? 可以先用变量为false然后再改为true即为手动上传
		upload_auto: {
			type: Boolean,
			default: true
		},
		// 是否显示删除
		upimg_move: {
			type: Boolean,
			default: true
		},
		// 服务器预览图片
		upimg_preview: {
			type: Array,
			default: () => {
				return [];
			}
		},
		// 服务器返回预览(看服务器卡顿情况设定)
		upimg_delaytime: {
			type: [Number, String],
			default: 300
		},
		// 请求头信息
		header: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	async created() {
		let _self = this;
		setTimeout(() => {
			this.upload_before_list = this.upload_before_list.concat(this.upimg_preview);
			this.upload_len = this.upload_before_list.length;
			this.upimg_preview.map(item => {
				// step2.这里修改服务器返回字段 ！！！
				this.upload_cache_list.push(item.path);
			});
			this.emit();
		}, this.upimg_delaytime);
	},
	methods: {
		upImage(paths,header) {
			let _self = this;
			const promises = paths.map(function(path) {
				return promisify(upload)({
					url: _self.url,
					path: path,
					name: 'file',
					extra: header,
					_self: _self
				});
			});

			uni.showLoading({
				title: `正在上传...`
			});

			Promise.all(promises)
				.then(function(data) {
					uni.hideLoading();
					_self.upload_cache_list.push(...data);
					_self.emit();
				})
				.catch(function(res) {
					uni.hideLoading();
				});
		},
		chooseImage() {
			let _self = this;
			uni.chooseImage({
				count: _self.upload_count - _self.upload_before_list.length,
				sizeType: ['compressed', 'original'],
				sourceType: ['album', 'camera'],
				success: function(res) {
					for (let i = 0, len = res.tempFiles.length; i < len; i++) {
						res.tempFiles[i]['upload_percent'] = 0;
						_self.upload_before_list.push(res.tempFiles[i]);
					}
					_self.upload_cache = res.tempFilePaths;
					_self.upload(_self.upload_auto);
				},
				fail: function(err) {
					console.log(err);
				}
			});
		},
		async upload(upload_auto) {
			let _self = this;
			upload_auto ? await _self.upImage(_self.upload_cache,_self.header) : console.warn(`传输参数:this.$refs.xx.upload(true)才可上传,默认false`);
		},
		previewImage(idx) {
			let _self = this;
			let preview = [];
			for (let i = 0, len = _self.upload_before_list.length; i < len; i++) {
				// step3.这里修改服务器返回字段 ！！！
				preview.push(_self.upload_before_list[i].path);
			}
			uni.previewImage({
				current: idx,
				urls: preview
			});
		},
		removeImage(idx) {
			let _self = this;
			_self.upload_before_list.splice(idx, 1);
			_self.upload_cache_list.splice(idx, 1);
			_self.upload_len = _self.upload_before_list.length;
			_self.emit();
		},
		emit() {
			let _self = this;
			_self.$emit('change', _self.upload_cache_list);
		}
	}
};

const promisify = api => {
	return function(options, ...params) {
		return new Promise(function(resolve, reject) {
			api(
				Object.assign({}, options, {
					success: resolve,
					fail: reject
				}),
				...params
			);
		});
	};
};

const upload = function(options) {
	let url = options.url,
		_self = options._self,
		path = options.path,
		name = options.name,
		// data = options.data,
		extra = options.extra,
		success = options.success,
		progress = options.progress,
		fail = options.fail;

	const uploadTask = uni.uploadFile({
		url: url,
		filePath: path,
		name: name,
		formData: extra,
		success: function(res) {
			var data = res.data;
			console.warn('sunui-upimg - 如发现没有获取到返回值请到源码191行修改后端返回图片路径以便正常使用插件', JSON.parse(data));
			try {
				//Tip : 切记->主要修改这里图片的返回值为真实返回路径!!! 详情见示例
				data = JSON.parse(res.data).info;
			} catch (e) {
				throw (e, data);
			}
			// 根据自己的返回数据做相应判断,服务器返回200即代表成功请求
			if (res.statusCode == 200) {
				if (success) {
					success(data);
				}
			} else {
				if (fail) {
					fail(data);
				}
			}
		},
		fail: function(res) {
			console.log(res);
			if (fail) {
				fail(res);
			}
		}
	});
	uploadTask.onProgressUpdate(async function(res) {
		for (let i = 0, len = _self.upload_before_list.length; i < len; i++) {
			_self.upload_before_list[i]['upload_percent'] = await res.progress;
		}
		_self.upload_before_list = _self.upload_before_list;
		_self.upload_len = _self.upload_before_list.length;
	});
};
</script>

<style lang="scss">
@font-face {
	font-family: 'iconfont';
	src: url('//at.alicdn.com/iconfont.eot?t=1574391686418');
	/* IE9 */
	src: url('//at.alicdn.com/iconfont.eot?t=1574391686418#iefix') format('embedded-opentype'),
		/* IE6-IE8 */
			url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMkAAsAAAAAB2QAAALYAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqCYIJEATYCJAMICwYABCAFhG0HPRt3BhEVlCNkH4dxmzUXNsJHc1SNfR9KTkCtiXv/l+QDBQSFRBJdKoEsg60HUgCsOpWVnWxNx3BvVITqkj3fepbtzM/OfDo4D86iFEIiJAeX02+Bh/O84TLmsrEnYBxQoHtgm6xACoxTkN0zFsgEdQynCShpq7cwbsK0eTKROSkgbNu8cbUspRFrkoNMkC9ZGYWjcrJkX/IIR/zPhz/6hIxELmWmzdowfp1RvxdbYWm1VrUMCO54JvDrSNEbkTCv1DJDGvp6S5VUX9SRdSUHfi+u1cBZ7R+PQMgzEyugNcU5J67DO9VfJiCigD042iuNQqXSunGRfvrWV6/mvX49/+3bhW/eLHr4puOFtxMfvO5w9tX8yv7rIbf3Rrl84Mbe66XSzWet46nn/etMuALua5LqNZUqpKdfDKjsv2qef+yambJsTWM2zDtKIQ0pS7msvSTUpn1tNyts2xZmWUyw3LI4bPisSZNyOUc2y4/scfZs3QZ1UcgqUWtkVednsvnVs7NOHzmqglXIBnqU7+/M9Hp3y3L2RLWYA9uhlat61/LGGwVqt9Nvafv/8R2fmg/pu7LesH9ZOYL3/6e3P6Z2O0rbIztra+Dtc1u2RY1vapOocEtDiT0Kd1VUUkIN42joS19Fk1s1BVmKy0OioA2kMp1REdcbcsr6QV5mJJT0MnF9mbQRchZiET29CAT1fSBR1y1I1fdFRdwPcpr6Q179cIaSBaHRjmVdgxFjCSvGFuonmGYcpK1nESRfUC1dRUm+T3ggeeOEOIiywRwHpDHm+FUlzBIkjT1k5DzsuhEmGi02HGjmKQ1DWfaioBn7gzAWQRWGWqD2BIzGaCDRm4nc+y+QsuhUqKaqyviAiGcGB7FA1AKVS4ZWVddyibdSEoxJQCKjHsjIMNTpjMBUPsxCDRbQPTyTVGh1k20lwfyy/un2QYmpTII1I9Vo+1B4XQ2q0QvwvExGfTgA')
			format('woff2'),
		url('//at.alicdn.com/iconfont.woff?t=1574391686418') format('woff'), url('//at.alicdn.com/iconfont.ttf?t=1574391686418') format('truetype'),
		/* chrome, firefox, opera, Safari, Android, iOS 4.2+ */ url('//at.alicdn.com/iconfont.svg?t=1574391686418#iconfont') format('svg');
	/* iOS 4.1- */
}

@charset "UTF-8";

.iconfont {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-mn_shangchuantupian {
	&:before {
		content: '\e559';
	}
	font-size: 3em;
}

.sunui-uploader-img {
	display: block;
}

.sunui-uploader-input {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

.sunui-uploader-inputbox {
	position: relative;
	margin-bottom: 16rpx;
	box-sizing: border-box;
	background-color: #ededed;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.sunui-img-removeicon {
	position: absolute;
	color: #fff;
	width: 40upx;
	height: 40upx;
	line-height: 40upx;
	z-index: 2;
	text-align: center;
	background-color: #e54d42;

	&.right {
		top: 0;
		right: 0;
	}
}

.sunui-uploader-file {
	position: relative;
	margin-right: 16rpx;
	margin-bottom: 16rpx;
}

.sunui-uploader-file-status:before {
	content: ' ';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.sunui-loader-filecontent {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #fff;
	z-index: 9;
}

.sunui-uploader-bd {
	padding: 26rpx;
	margin: 0;
}

.sunui-uploader-files {
	display: flex;
	flex-wrap: wrap;
}

.sunui-uploader-file:nth-child(4n + 0) {
	margin-right: 0;
}

.sunui-uploader-inputbox > view {
	text-align: center;
}

.sunui-uploader-file-status:after {
	content: ' ';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.sunui-uploader-hover {
	box-shadow: 0 0 0 #e5e5e5;
	background: #e5e5e5;
}
</style>
