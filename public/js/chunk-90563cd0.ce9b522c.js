(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-90563cd0"],{1444:function(e,t,r){},"2f50":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"mui-content content"},[r("form",{staticClass:"mui-input-group"},[r("div",{staticClass:"mui-input-row"},[r("label",[e._v("用户名")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.username,expression:"user.username"}],staticClass:"mui-input-clear",attrs:{type:"text",placeholder:"请输入用户名"},domProps:{value:e.user.username},on:{input:function(t){t.target.composing||e.$set(e.user,"username",t.target.value)}}})]),r("div",{staticClass:"mui-input-row"},[r("label",[e._v("邮箱")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.email,expression:"user.email"}],staticClass:"mui-input-clear",attrs:{type:"text",placeholder:"请输入邮箱"},domProps:{value:e.user.email},on:{input:function(t){t.target.composing||e.$set(e.user,"email",t.target.value)}}})]),r("div",{staticClass:"mui-input-row"},[r("label",[e._v("密码")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.password,expression:"user.password"}],staticClass:"mui-input-password",attrs:{type:"password",placeholder:"请输入密码"},domProps:{value:e.user.password},on:{input:function(t){t.target.composing||e.$set(e.user,"password",t.target.value)}}})]),r("div",{staticClass:"mui-input-row"},[r("label",[e._v("确认密码")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.againPass,expression:"user.againPass"}],staticClass:"mui-input-password",attrs:{type:"password",placeholder:"请确认密码"},domProps:{value:e.user.againPass},on:{input:function(t){t.target.composing||e.$set(e.user,"againPass",t.target.value)}}})]),r("div",{staticClass:"mui-input-row",attrs:{id:"code"}},[r("label",[e._v("认证码")]),r("input",{directives:[{name:"model",rawName:"v-model",value:e.user.vCode,expression:"user.vCode"}],staticClass:"mui-input-clear",attrs:{type:"text",placeholder:"认证码"},domProps:{value:e.user.vCode},on:{input:function(t){t.target.composing||e.$set(e.user,"vCode",t.target.value)}}}),r("a",{staticClass:"getCode",attrs:{href:"#"},on:{click:e.getCode}},[e._v(e._s(e.codeMsg))])]),r("div",{staticClass:"mui-button-row"},[r("button",{staticClass:"mui-btn mui-btn-primary",attrs:{type:"button",disabled:e.disabled},on:{click:e.register}},[e._v("注册")])])]),r("a",{staticClass:"login-now",attrs:{href:"javascript:;"},on:{click:e.login}},[e._v("立即登录")])])])},s=[],n=(r("498a"),r("96cf"),r("1da1")),i={data:function(){return{user:{username:"",email:"",password:"",againPass:"",vCode:""},disabled:!1,codeMsg:"获取验证码",interval:null}},created:function(){this.$store.commit("modifyTitle","注册")},beforeDestroy:function(){clearInterval(this.interval)},methods:{login:function(){this.$router.push("/login")},getCode:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,a,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(r=/^\d{5,12}@[qQ][qQ]\.(com|cn)$/,0!==e.user.username.trim().length){t.next=6;break}return e.mui.alert("用户名不能为空"),t.abrupt("return");case 6:if(0!==e.user.email.trim().length){t.next=11;break}return e.mui.alert("邮箱不能为空"),t.abrupt("return");case 11:if(r.test(e.user.email.trim())){t.next=14;break}return e.mui.alert("邮箱格式错误"),t.abrupt("return");case 14:if(null===e.interval){t.next=16;break}return t.abrupt("return");case 16:return t.next=18,e.$http.post("getCode",{username:e.user.username,email:e.user.email});case 18:a=t.sent,console.log(a.data),0===a.data.code&&(s=30,e.interval=setInterval((function(){if(0===s)return clearInterval(e.interval),e.interval=null,void(e.codeMsg="获取验证码");s=parseInt(s)-1,e.codeMsg="已发送".concat(s,"s"),console.log(s)}),1e3)),e.mui.toast(a.data.msg);case 22:case"end":return t.stop()}}),t)})))()},register:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(r=/^\d{5,12}@[qQ][qQ]\.(com|cn)$/,0!==e.user.username.trim().length){t.next=6;break}return e.mui.alert("用户名不能为空"),t.abrupt("return");case 6:if(0!==e.user.email.trim().length){t.next=11;break}return e.mui.alert("邮箱不能为空"),t.abrupt("return");case 11:if(r.test(e.user.email.trim())){t.next=16;break}return e.mui.alert("邮箱格式错误"),t.abrupt("return");case 16:if(!(e.user.password.trim().length<6)){t.next=21;break}return e.mui.alert("密码长度至少6位"),t.abrupt("return");case 21:if(!(e.user.againPass.trim().length<6)){t.next=26;break}return e.mui.alert("确认密码长度至少6位"),t.abrupt("return");case 26:if(0!==e.user.vCode.trim().length){t.next=31;break}return e.mui.alert("请输入正确的认证码"),t.abrupt("return");case 31:if(e.user.password===e.user.againPass){t.next=34;break}return e.mui.alert("两次输入的密码不一致"),t.abrupt("return");case 34:return e.disabled=!0,t.next=37,e.$http.post("register",e.user);case 37:a=t.sent,e.disabled=!1,e.mui.toast(a.data.msg),0===a.data.code&&setTimeout((function(){e.$router.push("/login")}),1e3);case 41:case"end":return t.stop()}}),t)})))()}}},u=i,o=(r("b4a4"),r("2877")),l=Object(o["a"])(u,a,s,!1,null,"1caff858",null);t["default"]=l.exports},b4a4:function(e,t,r){"use strict";var a=r("1444"),s=r.n(a);s.a}}]);
//# sourceMappingURL=chunk-90563cd0.ce9b522c.js.map