!function(t){var e={};function s(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);class i{constructor({transitionSpeed:t,key:e}){this.key=e,this.$el=null,this.bullets=new Map,this.transitionSpeed=t,this.generateDom()}generateDom(){const t=document.createElement("div");t.setAttribute("class","bullet-screen"),t.setAttribute("style","width: 100%;height:100%;position: absolute;top: 0;left: 0;right: 0;pointer-events: none;"),this.$el=t}loadBullet(t){this.randomLoadBullet(t)}randomLoadBullet(t){let e=this.findRange();if(e.length){this.$el.appendChild(t.$el);let s=t.$el.offsetHeight;if(e.forEach(t=>t[1]-=s),e=e.filter(t=>t[1]>t[0]),!e.length)return void this.unmountBullet(t);let i=e[0];e.length>1&&(i=e[Math.floor(Math.random()*e.length)]);let n=Math.floor(Math.random()*(i[1]-i[0]))+i[0];t.admission(n,this),this.bullets.set(t.data[this.key],t)}else this.unmountBullet(t)}findRange(){let t=Array.from(this.bullets.values()).filter(t=>!t.hadLeft),e=this.$el.offsetHeight;if(!t.length)return[[0,e]];t=t.map(t=>[t.$el.offsetTop,t.$el.offsetTop+t.$el.offsetHeight]).sort((t,e)=>t[0]-e[0]);let s=[];return t.forEach((i,n)=>{0===n?s.push([0,i[0]]):s.push([t[n-1][1],i[0]]),n===t.length-1&&s.push([i[1],e])}),s}unmountBullet(t){this.$el.removeChild(t.$el),this.bullets.delete(t.data[this.key])}destroy(){this.bullets.forEach(t=>{this.unmountBullet(t)})}}class n{constructor({data:t,render:e},s){this.$el=null,this.screen=s,this.top=0,this.left=0,this.hadLeft=!1,this.render=()=>{this.$el.innerHTML=this.data.value},this.data=t,"function"==typeof e&&(this.render=e),this.generateDom()}generateDom(){const t=document.createElement("div");t.setAttribute("class","bullet"),t.style.position="absolute",t.style["white-space"]="nowrap",this.$el=t,this.$el.appendChild(this.render.call(this,this.data))}admission(t,e){this.screen=e,this.top=t,this.$el.style.top=this.top+"px",this.left=e.$el.offsetWidth,this.$el.style.left=this.left+"px",this.$el.style.transition=`all ${this.screen.transitionSpeed/1e3}s linear`}updatePosition(t){if(this.$el&&this.$el.parentElement){let e=this.$el.parentElement.offsetWidth;this.left-=t,this.$el.style.left=this.left+"px",this.hadLeft||e>this.$el.offsetWidth+this.left&&(this.hadLeft=!0),this.left<-this.$el.offsetWidth&&this.screen.unmountBullet(this)}}}class l{constructor(t){this.$el=null,this.$parentEl=null,this.screen=null,this.options={key:"id",speed:1,fontSize:"16px",opacity:.8,el:""},this.timer,this.playing=!1,this.transitionSpeed=100,this.setOptions(t),this.init(),window.BulletScreenPlayer=this}setOptions(t){this.options=Object.assign({},this.options,t)}init(){this.generateScreen(),this.mount(this.options.el)}add(t){t.forEach(t=>{if(!t.hasOwnProperty(this.screen.key))throw new Error("The current object has no key, key is require, please set options.key");if(!this.screen.bullets.get(t[this.screen.key])){const e=new n({data:t,render:this.options.bulletRender});console.log("----------新入仓",e),this.screen.loadBullet(e),this.play()}})}play(){this.playing||(this.playing=!0,clearInterval(this.timer),this.timer=setInterval(()=>{this.screen&&this.screen.bullets.size?this.screen.bullets.forEach(t=>{t.updatePosition(5*this.options.speed)}):this.pause()},this.transitionSpeed))}pause(){clearInterval(this.timer),this.playing=!1}stop(){this.pause(),this.screen.destroy()}generateScreen(){this.screen=new i({transitionSpeed:this.transitionSpeed,key:this.options.key}),this.$el=this.screen.$el}mount(t){let e=null;t instanceof Element?e=t:"string"==typeof t&&document.querySelector(t)&&(e=document.querySelector(t)),e&&(this.$parentEl=e,this.$parentEl.appendChild(this.$el))}destroy(){this.stop(),this.$parentEl&&(this.$parentEl.removeChild(this.$el),this.$el=null)}}window.BulletScreen=l,e.default=l}]);