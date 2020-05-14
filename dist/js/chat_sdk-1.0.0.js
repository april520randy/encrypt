;
(function(undefined) {
	"use strict"
	var _global;

	function get_iframe_url() {
		var script = document.querySelector("script[src*=sdk]");
		return script ? script.src.split("/sdk")[0] : window.location.origin + "/login#/";
	}

	function chat_sdk(opts) {
		//没有参数传入，直接返回默认参数
		if (!opts) {
			console.log('必须传入参数');
			return options;
		}
		//校验参数
		if (!this._verify_parameter(opts)) {
			return;
		}

		//创建iFrame
		this._init_iFrame(opts.config);
		return this;
	}

	chat_sdk.prototype = {
		constructor: this,
		iFrame_url:get_iframe_url(),
		_init: function(opts) {
			//没有参数传入，直接返回默认参数
			if (!opts) {
				console.log('必须传入参数');
				return options;
			}
			//校验参数
			if (!this._verify_parameter(opts)) {
				return;
			}

			//创建iFrame
			this._init_iFrame();
		},
		//校验参数
		_verify_parameter(parameter) {
			if (parameter.hasOwnProperty('el')) {
				this.element_id = parameter.el;
			} else {
				console.log('缺少配置参数=>element_id')
				return false;
			}
			if (parameter.config.hasOwnProperty('sign')) {
				if (parameter.config.sign.length == 0) {
					console.log('sign值不能为空');
					return false;
				}
				this.sign = parameter.config.sign;
			} else {
				console.log('缺少配置参数->sign');
				return false;
			}

			if (parameter.config.hasOwnProperty('app_id')) {
				if (parameter.config.app_id.length == 0) {
					console.log('app_id值不能为空')
					return false;
				}
				this.app_id = parameter.config.app_id;
			} else {
				console.log('缺少配置参数->app_id')
				return false;
			}

			if (parameter.config.hasOwnProperty('merchant_chat_id')) {
				if (parameter.config.merchant_chat_id.length == 0) {
					console.log('merchant_chat_id值不能为空')
					return false;
				}
				this.merchant_chat_id = parameter.config.merchant_chat_id;
			} else {
				console.log('缺少配置参数->merchant_chat_id')
				return false;
			}
			if (parameter.config.hasOwnProperty('name')) {
				if (parameter.config.name.length == 0) {
					console.log('name值不能为空')
					return false;
				}
				this.name = parameter.config.name;
			} else {
				console.log('缺少配置参数->name')
				return false;
			}
			if (parameter.config.hasOwnProperty('timestamp')) {
				if (parameter.config.timestamp.length == 0) {
					console.log('timestamp值不能为空')
					return false;
				}
				this.timestamp = parameter.config.timestamp;
			} else {
				console.log('缺少配置参数->timestamp')
				return false;
			}
			if (parameter.config.hasOwnProperty('out_user_account')) {
				if (parameter.config.out_user_account.length == 0) {
					console.log('out_user_account值不能为空')
					return false;
				}
				this.out_user_account = parameter.config.out_user_account;
			} else {
				console.log('缺少配置参数->out_user_account')
				return false;
			}
			if (parameter.config.hasOwnProperty('avatar_url')) {
				this.avatar_url = parameter.config.avatar_url;
			} else {
				this.avatar_url = '';
			}
			if (parameter.config.hasOwnProperty('start_at')) {
				this.start_at = parameter.config.start_at;
			} else {
				this.start_at = '';
			}
			if (parameter.config.hasOwnProperty('end_at')) {
				this.end_at = parameter.config.end_at;
			} else {
				this.end_at = '';
			}
			if (parameter.hasOwnProperty('onSuccess')) {
				this.onSuccess_callback = parameter.onSuccess;
			}
			if (parameter.hasOwnProperty('onFail')) {
				this.onFail_callback = parameter.onFail;
			}
			if (parameter.hasOwnProperty('onMessage')) {
				this.onMessage_callback = parameter.onMessage;
			}

			return true;
		},
		//创建iFrame
		_init_iFrame(config) {

			//动态创建iframe
			 this.chat_iframe = document.createElement('iframe');
			this.chat_iframe.name = "chat_iframe";
			this.chat_iframe.src = this.iFrame_url;
			this.chat_iframe.id = 'chat_iframe';
			this.chat_iframe.width = '100%';
			this.chat_iframe.height = '100%';
			this.chat_iframe.scrolling = 'no';
			this.chat_iframe.frameborder = '0';


			//加载完毕后传入参数
			this.chat_iframe.onload = () => {
				//通过postMessage传入参数给iframe解决跨域访问的问题
				window.frames["chat_iframe"].postMessage(config, this.iFrame_url);
			}

			if (typeof(this.element_id) == 'string') {
				//把iframe挂载到指定元素
				document.querySelector(this.element_id).appendChild(this.chat_iframe);
			} else {
				this.element_id.appendChild(this.chat_iframe);
			}
			//接受iframe传入的信息
			window.addEventListener('message', (event) => {
				if (event.data.cmd == 'success') {
					this._onSuccess();
				} else if (event.data.cmd == 'fail') {
					this._onFail(event.data);
				} else {
					this._onMessage(event.data);
				}
			})
		},
		//验证成功后返回
		_onSuccess: function() {

		},
		//验证失败后返回
		_onFail: function(res) {
			this.onFail_callback && this.onFail_callback(res);
		},
		//接收iFrame传入的消息
		_onMessage: function(res) {
			this.onMessage_callback && this.onMessage_callback(res);
		}
		
	}


	// 最后将插件对象暴露给全局对象
	_global = (function() {
		return this || (0, eval)('this');
	}());
	if (typeof module !== "undefined" && module.exports) {
		module.exports = chat_sdk;
	} else if (typeof define === "function" && define.amd) {
		define(function() {
			return chat_sdk;
		});
	} else {
		!('chat_sdk' in _global) && (_global.chat_sdk = chat_sdk);
	}
}());
