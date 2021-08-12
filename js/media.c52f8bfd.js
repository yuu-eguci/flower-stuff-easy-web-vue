(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["media"],{"0b42":function(e,t,a){var r=a("861d"),n=a("e8b5"),s=a("b622"),i=s("species");e.exports=function(e){var t;return n(e)&&(t=e.constructor,"function"!=typeof t||t!==Array&&!n(t.prototype)?r(t)&&(t=t[i],null===t&&(t=void 0)):t=void 0),void 0===t?Array:t}},"159b":function(e,t,a){var r=a("da84"),n=a("fdbc"),s=a("17c2"),i=a("9112");for(var o in n){var c=r[o],u=c&&c.prototype;if(u&&u.forEach!==s)try{i(u,"forEach",s)}catch(l){u.forEach=s}}},"17c2":function(e,t,a){"use strict";var r=a("b727").forEach,n=a("a640"),s=n("forEach");e.exports=s?[].forEach:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}},"21a9":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[e.showCameraIsStartingMessage?a("div",{staticClass:"position-relative",staticStyle:{height:"200px"}},[a("b-overlay",{attrs:{show:!0,"no-wrap":""},scopedSlots:e._u([{key:"overlay",fn:function(){return[a("div",{staticClass:"text-center"},[a("b-icon",{attrs:{icon:"camera-video",scale:"2",animation:"fade"}})],1),a("div",[e._v(" Camera is starting ... ")])]},proxy:!0}],null,!1,2853725799)})],1):e._e(),a("b-alert",{staticClass:"m-3",attrs:{show:e.showCameraIsUnavailableMessage,variant:"warning"}},[a("b-icon",{attrs:{icon:"camera-video-off"}}),e._v(" This application needs to access your camera. "),a("b-button",{staticClass:"mt-3",attrs:{variant:"warning",block:""},on:{click:e.onClickSignOutButton}},[a("b-icon",{attrs:{icon:"door-open"}}),e._v(" Sign out ")],1)],1),a("b-collapse",{staticClass:"position-relative",model:{value:e.showCollapseCamera,callback:function(t){e.showCollapseCamera=t},expression:"showCollapseCamera"}},[a("b-overlay",{attrs:{show:e.showCollapseCameraOverlay,"no-wrap":""},scopedSlots:e._u([{key:"overlay",fn:function(){return[a("div",{staticClass:"text-center"},[a("b-icon",{attrs:{icon:"cloud-upload",scale:"2",animation:"fade"}})],1),a("div",[e._v(" Sending and predicting ... ")])]},proxy:!0}])}),a("video",{ref:"video",staticClass:"mw-100 mh-100",attrs:{autoplay:"",playsinline:""},domProps:{srcObject:e.cameraStream}}),a("div",{staticClass:"m-3"},[a("b-button",{attrs:{variant:"primary",block:"",disabled:e.showCollapseCameraOverlay},on:{click:e.onClickPredictButton}},[a("b-icon",{attrs:{icon:"cloud-upload"}}),e._v(" Predict ")],1)],1),a("b-alert",{staticClass:"m-3",attrs:{show:""}},[a("b-icon",{attrs:{icon:"hand-index"}}),e._v(" Capture a flower on the camera. Then tap the Predict button. The photos will be sent to the server, but won't be saved. ")],1)],1),a("b-collapse",{model:{value:e.showCollapsePredictionResult,callback:function(t){e.showCollapsePredictionResult=t},expression:"showCollapsePredictionResult"}},[a("b-card",{staticClass:"m-3",attrs:{"img-src":e.imgSrcBase64,"img-top":"",title:"Prediction result","sub-title":"v"+e.predictionVersion}},[a("b-list-group",{attrs:{flush:""}},e._l(e.predictionResults,(function(t){return a("b-list-group-item",{key:t.id},[e._v(" "+e._s(t.name)+": "+e._s(t.confidence)),a("br"),a("b-link",{attrs:{href:"https://www.google.com/search?q="+t.name+"+flower&tbm=isch",target:"_blank"}},[a("b-icon",{attrs:{icon:"search"}}),e._v(" (Google) ")],1)],1)})),1),a("div",[a("b-button",{staticClass:"mt-3",attrs:{variant:"primary",block:""},on:{click:e.onClickBackButton}},[a("b-icon",{attrs:{icon:"camera-video"}}),e._v(" Back to camera ")],1)],1)],1)],1)],1)},n=[],s=a("1da1"),i=(a("96cf"),a("159b"),function(e){var t=e.getTracks();t.forEach((function(e){e.stop()}))}),o=function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(e.prev=0,t=navigator.mediaDevices.getSupportedConstraints(),t.aspectRatio&&t.width&&t.height&&t.facingMode){e.next=4;break}return e.abrupt("return",!1);case 4:return e.next=6,navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"environment"}});case 6:return e.abrupt("return",e.sent);case 9:return e.prev=9,e.t0=e["catch"](0),console.info({err:e.t0}),e.abrupt("return",null);case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}(),c=function(e){var t=document.createElement("canvas");if(e){var a=.5*e.offsetWidth,r=.5*e.offsetHeight;t.setAttribute("width",a),t.setAttribute("height",r),t.getContext("2d").drawImage(e,0,0,a,r);var n=t.toDataURL("image/jpg");return n}},u={name:"MediaView",components:{},data:function(){return{showCameraIsStartingMessage:!0,showCameraIsUnavailableMessage:!1,cameraStream:null,showCollapseCameraOverlay:!1,showCollapseCamera:!1,showCollapsePredictionResult:!1,imgSrcBase64:"",predictionResults:[],predictionVersion:""}},computed:{},watch:{},mounted:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,o();case 2:if(a=t.sent,a){t.next=6;break}return setTimeout((function(){e.showCameraIsUnavailableMessage=!0,e.showCameraIsStartingMessage=!1}),1e3),t.abrupt("return");case 6:e.cameraStream=a,setTimeout((function(){e.showCameraIsStartingMessage=!1,e.showCollapseCamera=!0}),5e3);case 8:case"end":return t.stop()}}),t)})))()},methods:{onClickPredictButton:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t,a=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(this.showCollapseCameraOverlay=!0,this.imgSrcBase64=c(this.$refs.video),this.imgSrcBase64){e.next=5;break}return this.showCollapseCameraOverlay=!1,e.abrupt("return");case 5:t={result:[{name:"Windflower",confidence:.6562319},{name:"Pansy",confidence:.16973963},{name:"Snowdrop",confidence:.119459644}],version:"0.0.0"},this.predictionResults=t.result,this.predictionVersion=t.version,setTimeout((function(){a.showCollapseCameraOverlay=!1,i(a.cameraStream),a.cameraStream=null,a.showCollapseCamera=!1,setTimeout((function(){a.showCollapsePredictionResult=!0}),500)}),5e3);case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),onClickBackButton:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.showCameraIsStartingMessage=!0,this.showCollapsePredictionResult=!1,this.imgSrcBase64="",this.predictionResults=[],this.predictionVersion="",e.next=7,o();case 7:this.cameraStream=e.sent,setTimeout((function(){t.showCameraIsStartingMessage=!1,t.showCollapseCamera=!0}),3e3);case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),onClickSignOutButton:function(){this.$router.push({path:"/"})}}},l=u,p=a("2877"),h=Object(p["a"])(l,r,n,!1,null,null,null);t["default"]=h.exports},"65f0":function(e,t,a){var r=a("0b42");e.exports=function(e,t){return new(r(e))(0===t?0:t)}},a640:function(e,t,a){"use strict";var r=a("d039");e.exports=function(e,t){var a=[][e];return!!a&&r((function(){a.call(null,t||function(){throw 1},1)}))}},b727:function(e,t,a){var r=a("0366"),n=a("44ad"),s=a("7b0b"),i=a("50c4"),o=a("65f0"),c=[].push,u=function(e){var t=1==e,a=2==e,u=3==e,l=4==e,p=6==e,h=7==e,m=5==e||p;return function(d,f,v,w){for(var b,C,g=s(d),y=n(g),k=r(f,v,3),x=i(y.length),S=0,R=w||o,_=t?R(d,x):a||h?R(d,0):void 0;x>S;S++)if((m||S in y)&&(b=y[S],C=k(b,S,g),e))if(t)_[S]=C;else if(C)switch(e){case 3:return!0;case 5:return b;case 6:return S;case 2:c.call(_,b)}else switch(e){case 4:return!1;case 7:c.call(_,b)}return p?-1:u||l?l:_}};e.exports={forEach:u(0),map:u(1),filter:u(2),some:u(3),every:u(4),find:u(5),findIndex:u(6),filterReject:u(7)}},e8b5:function(e,t,a){var r=a("c6b6");e.exports=Array.isArray||function(e){return"Array"==r(e)}}}]);
//# sourceMappingURL=media.c52f8bfd.js.map