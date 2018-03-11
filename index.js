import Vue from "vue";
import Index from './components/index/index';
import Cover from './components/cover/index';
import Obserable from './components/lib/obserable';
import imgs from './components/lib/assets'
import zmitiUtil from './components/lib/util.js'
import $ from 'jquery';
import './components/lib/touch.js';


var obserable = new Obserable();


//Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
	data: {
		obserable,
		rotate: false,
		imgs,
		showMask: false,
		viewH: document.documentElement.clientHeight,
		isShare: false,
		show: false,
		periodsUpper: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
		username: '',
		pv: 0,
		totalpv: 0, //几期的总浏览量
		randomPv: 0,
		width: 0,
		loaded: false,
		playStyle: {

		}
	},
	el: '#app',
	/**/
	template: `<div>
		<Index v-if='show' :obserable='obserable'></Index>
		<Cover v-if='show'  :obserable='obserable'></Cover>
		
		<div  @touchstart='toggleMusic' class='zmiti-play' :class='{"rotate":rotate}' :style="playStyle">
			<img  :src='imgs.play2'/>
		</div>
		<div  v-if='!loaded' :style='{background:"#158ae4"}' class='zmiti-loading lt-full'>
			<div class='zmiti-loading-ui'>
				 <a href="#">
			  		<section class='zmiti-head' :style="{background:'url(./assets/images/logo.png) no-repeat center / cover'}"></section>
			        <div class="line1"></div>
			        <div class="line2"></div>
			        <div class="line3"></div>
					<div class='zmiti-progress'>{{width}}%</div>
			    </a>
			</div>
			<img style='position:absolute;z-index:10;' :src="imgs.loading1" alt="" />
		</div>
			<audio ref='audio' src='./assets/music/bg4.mp3'  loop></audio>
	</div>`,
	methods: {

		loading: function(arr, fn, fnEnd) {
			var len = arr.length;
			var count = 0;
			var i = 0;

			function loadimg() {
				if (i === len) {
					return;
				}
				var img = new Image();
				img.onload = img.onerror = function() {
					count++;
					if (i < len - 1) {
						i++;
						loadimg();
						fn && fn(i / (len - 1), img.src);
					} else {
						fnEnd && fnEnd(img.src);
					}
				};
				img.src = arr[i];
			}
			loadimg();
		},
		toggleMusic() {
			var music = this.$refs['audio'];
			obserable.trigger({
				type: 'toggleBgMusic',
				data: !this.rotate
			});
			/*var music = this.$refs['audio'];
			music[music.paused ? 'play' : 'pause']()*/
		},

		updatePv() {

			$.ajax({
				url: window.protocol + '//api.zmiti.com/v2/custom/update_pvnum/',
				type: 'post',
				data: {
					customid: 44
				}
			}).done((data) => {
				if (data.getret === 0) {
					this.pv = data.totalpv;
					this.randomPv = data.randtotalpv;
					var totalpv = this.randomPv;
				}
			});
		}
	},
	components: {
		Index,
		Cover
	},
	mounted() {


		var src = (zmitiUtil.getQueryString('src'));

		this.isShare = src;



		this.src = src;


		this.loading(arr, (s) => {
			this.width = s * 100 | 0;

		}, () => {
			this.show = true;
			setTimeout(() => {
				this.loaded = true;
			}, 400)
		})

		obserable.on('showShare', () => {
			this.showMask = true;
		})


		obserable.on('setPlay', (data) => {

			this.playStyle = data;

		});


		$(this.$refs['audio']).on('play', () => {
			this.rotate = true;
		}).on('pause', () => {
			this.rotate = false;
		});

		//this.$refs['audio'].volume = .3;
		this.$refs['audio'].play();
		var s = this;
		document.addEventListener("WeixinJSBridgeReady", function() {
			WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
				s.$refs['audio'].play();
			});
		}, false)


		var audio = this.$refs['audio'];
		var play = function() {
			document.removeEventListener("WeixinJSBridgeReady", play);
			document.removeEventListener("YixinJSBridgeReady", play);
			audio.play();
		};

		audio.play();
		if (window.WeixinJSBridge) {
			audio.play();
		}
		//weixin
		if (typeof WeixinJSBridge == "undefined") {
			document.addEventListener("WeixinJSBridgeReady", play, false);
		} else {
			//yixin
			document.addEventListener('YixinJSBridgeReady', play, false);
			audio.play();
		}

		obserable.on('toggleBgMusic', (data) => {
			var volume = 1;
			if (data) { //play
				volume = 0;
			}
			clearInterval(this.audioTimer);
			var audio = this.$refs['audio'];
			audio[data ? 'play' : 'pause']();
			return;
			console.log(data);
			this.audioTimer = setInterval(() => {

				if (data) {
					this.rotate = true;
					volume += 0.01;
					if (volume >= 1) {
						volume = 1;
						clearInterval(this.audioTimer);
						//audio.play();
					}
				} else {
					volume -= .01;
					if (volume <= 0) {
						volume = 0;
						this.rotate = false;
						clearInterval(this.audioTimer)
						//audio.pause();
					}
				}
				//console.log(volume)

				//document.title = volume.toFixed(1) * 1;

				//audio.volume = volume.toFixed(1) * 1;

			}, 20)
		});

		this.updatePv();


		zmitiUtil.wxConfig(document.title, window.desc);

		if (this.isShare) {
			setTimeout(() => {
				obserable.trigger({
					type: 'showIndexApp',
					data: {
						src
					}
				})
			}, 100)
		} else {

			//zmitiUtil.getOauthurl();
			//zmitiUtil.wxConfig(document.title, window.desc);
		}
	}
})