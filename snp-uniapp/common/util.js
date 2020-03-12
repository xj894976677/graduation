function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

function formatMoney (value, decimals) {
	  var digitsRE = /(\d{3})(?=\d)/g;//定义对比
	  value = parseFloat(value)//把字符串转换成数字
	  if(!isFinite(value) || (!value && value !== 0)){//如果它不是有限位数或者
		  return '';
	  }
	  //currency = currency != null ? currency : '$';//如果第二位参数为空，那么就在最前面换成$符号
	  decimals = decimals != null ? decimals : 2;//如果第3位参数为空，那么就保留2位小数。5221.84
	  var stringified = Math.abs(value).toFixed(decimals);//先求绝对值,然后在保留2位小数
	  var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified; //验证合法性
	  var i = _int.length % 3; //进行分割，需要几个逗号
	  var head = i > 0 ? (_int.slice(0, i) + (_int.length > 3 ? ',' : '')) : '' ;//
	  var _float = decimals ? stringified.slice(-1 - decimals) : ''
	  var sign = value < 0 ? '-' : ''
	  return sign + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}

function getClientIp() {
	// 同步方式获取数据
	try {
		const ip = uni.getStorageSync('cip');
		if (value) {
			console.log("const value = uni.getStorageSync('cip') 同步获取 = " + value)
			return ip;
		}
	} catch (e) {};
	// 调用搜狐API获取外网IP
	var ip = "127.0.0.1";
	uni.request({
		url: 'http://pv.sohu.com/cityjson?ie=utf-8',
		success: res => {
			console.log(res);
			var resData = res.data.substring(19, res.data.length - 1);
			console.log(resData);
			var returnCitySN = JSON.parse(resData);
			var clientIp = returnCitySN['cip'];
			console.log(clientIp);
			ip = clientIp;
		}
	});
	//同步数据缓存
	try {
		uni.setStorageSync('cip', ip);
	} catch (e) {};
	return ip;
}

var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	formatMoney: formatMoney,
	getClientIp: getClientIp,
	dateUtils: dateUtils
}