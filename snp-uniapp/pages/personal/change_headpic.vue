<template>
	<view>
		<view>
			<cu-custom :isBack="true" style="color: #FFFFFF;">
				<block slot="backText">返回</block>
				<block slot="content">修改头像</block>
			</cu-custom>
		</view>
		<view class="sunui-uploader-files">
			<view class="cu-avatar round lg" :style="{backgroundImage:'url(' + headpic + ')'}" @tap="chooseImage"></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			headpic: '',
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
					console.log(res)
					console.log("2"+_self.headpic)
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
			console.log("idx"+idx)
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
				console.log(data)

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
page {
	background-image: linear-gradient(45deg, #0081ff, #1cbbb4);
}
</style>
