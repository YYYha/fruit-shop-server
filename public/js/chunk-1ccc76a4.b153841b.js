(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1ccc76a4"],{"067f":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mui-content"},[a("div",{staticClass:"search-box"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.inputSearch,expression:"inputSearch"}],attrs:{type:"text",placeholder:"请输入要搜索的商品"},domProps:{value:t.inputSearch},on:{input:function(e){e.target.composing||(t.inputSearch=e.target.value)}}}),a("div",{staticClass:"fa fa-search",on:{click:t.search}})]),a("div",{staticClass:"search-history"},[a("div",{staticClass:"search-history-text"},[a("span",[t._v("历史搜索")]),a("span",{staticClass:"fa fa-trash-o",on:{click:t.del}})]),a("div",{staticClass:"search-list"},t._l(t.history,(function(e,r){return a("span",{key:r},[t._v(t._s(e))])})),0)])])},s=[],n=(a("96cf"),a("1da1")),i={data:function(){return{inputSearch:"",history:[]}},created:function(){this.$store.commit("modifyTitle","搜索中心"),this.history=JSON.parse(localStorage.getItem("history"))},methods:{search:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(console.log(t.inputSearch),0!==t.inputSearch.length){e.next=3;break}return e.abrupt("return");case 3:return e.next=5,t.$http.get("search?content=".concat(t.inputSearch));case 5:if(a=e.sent,200===a.status){e.next=9;break}return t.mui.toast("网络请求失败"),e.abrupt("return");case 9:if(0!==a.data.length){e.next=12;break}return t.mui.toast("暂无查询结果"),e.abrupt("return");case 12:t.$store.commit("modifySearchList",a.data),t.$router.push("/search-result"),r=JSON.parse(localStorage.getItem("history"))||[],r.push(t.inputSearch),localStorage.setItem("history",JSON.stringify(r));case 17:case"end":return e.stop()}}),e)})))()},del:function(){localStorage.removeItem("history"),this.history=JSON.parse(localStorage.getItem("history"))}}},c=i,o=(a("8449"),a("2877")),u=Object(o["a"])(c,r,s,!1,null,"31216fb9",null);e["default"]=u.exports},8449:function(t,e,a){"use strict";var r=a("b212"),s=a.n(r);s.a},b212:function(t,e,a){}}]);
//# sourceMappingURL=chunk-1ccc76a4.b153841b.js.map