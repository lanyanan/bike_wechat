webpackJsonp([26],{775:function(t,e,n){var a=n(0)(n(823),n(923),null,null);t.exports=a.exports},823:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{nickname:null}},methods:{setNickname:function(){this.$http({method:"post",url:BASE_URL+"/lock-account/extra_account_info",headers:{"Content-Type":"application/json"},data:{nickname:this.nickname}}).then(function(t){this.$vux.toast.show({text:"成功"}),this.$router.back()}.bind(this)).catch(function(t){var e="";if(t.response){var n=t.response.data;n.status;e=n.error}else e=t.request?t.request:t.message;this.$vux.toast.show({type:"warn",text:e})}.bind(this))}},computed:{confirmDisabled:function(){return!this.nickname}},created:function(){this.$http({url:BASE_URL+"/lock-account/extra_account_info"}).then(function(t){var e=t.data;if(0==e.status){var n=e.nickname;if(n)this.nickname=n;else{var a=window.USER.phone;this.nickname=a}}}.bind(this)).catch(function(t){var e="";if(t.response){var n=t.response.data;n.status;e=n.error}else e=t.request?t.request:t.message;this.$vux.toast.show({type:"warn",text:e})}.bind(this))}}},923:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("yb-content-main",[n("yb-header",{attrs:{"left-options":{backText:"",preventGoBack:!1}},slot:"header"},[t._v("\n        设置昵称\n    ")]),t._v(" "),n("div",{slot:"main"},[n("group",{attrs:{title:""}},[n("x-input",{staticClass:"weui-vcode",attrs:{type:"text",placeholder:"昵称"},model:{value:t.nickname,callback:function(e){t.nickname=e},expression:"nickname"}})],1),t._v(" "),n("div",{staticStyle:{padding:"15px"}},[n("x-button",{attrs:{type:"primary",disabled:t.confirmDisabled},nativeOn:{click:function(e){t.setNickname()}}},[t._v("确定")])],1)],1)],1)},staticRenderFns:[]}}});
//# sourceMappingURL=26.108eb2705d41aacd7c2e.js.map