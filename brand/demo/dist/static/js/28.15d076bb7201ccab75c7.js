webpackJsonp([28],{758:function(t,e,a){var n=a(0)(a(805),a(905),null,null);t.exports=n.exports},805:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(12),i=a.n(n);e.default={data:function(){return{step:2,name:"",id:""}},methods:{auth:function(){this.$http({method:"post",url:BASE_URL+"/lock-account/verify",headers:{"Content-Type":"application/json","X-Auth-Token":window.USER.token},data:{idcard:this.id,name:this.name}}).then(function(t){var e=t.data.status;0==e?(this.$vux.toast.show({text:"成功"}),window.USER.isRealNameAuth=!0,localStorage.setItem(USER_CACHE_KEY,i()(window.USER)),this.$router.replace({path:"/"})):this.$vux.toast.show({type:"warn",text:"错误："+e})}.bind(this)).catch(function(t){this.$vux.toast.show({type:"warn",text:"出现错误"}),console.log(t)}.bind(this))}},computed:{authDisabled:function(){return!this.name||!this.id}},created:function(){}}},905:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("yb-content-main",[a("yb-header",{attrs:{"left-options":{backText:"",preventGoBack:!0}},on:{"on-click-back":function(e){t.$router.push({path:"/ucenter"})}},slot:"header"},[t._v("\n        实名认证\n    ")]),t._v(" "),a("div",{slot:"main"},[a("div",{staticClass:"register-step"},[a("group",[a("step",{model:{value:t.step,callback:function(e){t.step=e},expression:"step"}},[a("step-item",{attrs:{title:"手机绑定"}}),t._v(" "),a("step-item",{attrs:{title:"押金充值"}}),t._v(" "),a("step-item",{attrs:{title:"实名认证"}}),t._v(" "),a("step-item",{attrs:{title:"开始用车"}})],1)],1)],1),t._v(" "),a("group",{staticClass:"weui-cells_form",attrs:{title:""}},[a("x-input",{staticClass:"weui-vcode",attrs:{"is-type":"china-name",title:"姓名",placeholder:"请输入真实姓名"},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}}),t._v(" "),a("x-input",{staticClass:"weui-vcode",attrs:{type:"text",title:"身份证号",placeholder:"请输入身份证号"},model:{value:t.id,callback:function(e){t.id=e},expression:"id"}})],1),t._v(" "),a("div",{staticStyle:{padding:"15px"}},[a("x-button",{attrs:{type:"warn",disabled:t.authDisabled},nativeOn:{click:function(e){t.auth()}}},[t._v("认证")]),t._v(" "),a("div",{staticStyle:{padding:"8px","text-align":"center",color:"#666666"}},[a("span",{staticStyle:{color:"red"}},[t._v("无中华人民共和国居民身份证，请点击这里")])])],1)],1)],1)},staticRenderFns:[]}}});
//# sourceMappingURL=28.15d076bb7201ccab75c7.js.map