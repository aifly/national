<template>
	<div  class="lt-full zmiti-index-main-ui " :style="{height:viewH+'px',width:viewW+'px',position:'fixed'}"  :class="{'show':show}">
		<div class="zmiti-index-main">
			<section class="zmiti-list-main-ui lt-full">
				<div class="zmiti-index-title1">
					<img :src="imgs.title1" alt="">

					<div class="zmiti-audio-btn" :class="{'active':isPress}"  @touchend='choose($event)'>
						<img :src="imgs.play">
					</div>
				</div>
				<h1></h1>
				<section>
					<div class="zmiti-nation-list">
						<div :class='{"hide":isChoosed && showIdIndex<i,"active":i === iNow}' v-for='(data,i) in dataList' class="zmiti-list-group" @touchend='playAudio(data,i)'>
							<img :src="data.img" />
							 <audio :key='i'  ref='audio1'>
								<source :src='data.audio'  type="audio/mp3" />
							</audio>
						</div>
					</div>
					
					<div :style="{height:'.77rem'}"></div>
					
					<div class="zmiti-team-btn" @touchend='showTeam = true'>
						<img :src="imgs.teamBtn" />
					</div>
				</section>
			</section>
		</div>

		<div v-if='currentIndex>-1' class="zmiti-dialog-main-ui lt-full">
			<div @touchend='closeDialog' class="lt-full zmiti-dialog-other"></div>
			<div class='zmiti-dialog-img-C' >
				<img :src="imgs.imgBg">
				<img :src="dataList[currentIndex].img" />
				<div>
					<div>{{dataList[currentIndex].address}}</div>
					<div>
						<span>{{dataList[currentIndex].name}}</span>
						<span>{{dataList[currentIndex].national}}</span>
					</div>
				</div>
			</div>
		</div>


		<div v-if='showMasks' @touchstart='hideMask' class="zmiti-mask" :style="{background: 'url('+imgs.arrow1+') no-repeat center top',backgroundSize:'cover'}">
			
		</div>
		
			<transition name='team'>
				<div :key='1' v-show='showTeam' @touchend='showTeam = false' class="zmiti-team lt-full" :style='{background:"url("+imgs.team+") no-repeat center center",backgroundSize:"cover"}'>
				</div>
			</transition>

		

		<audio src='./assets/music/count1.mp3' ref='count'></audio>
		<audio src='./assets/music/press.mp3' ref='press' loop></audio>
		



	</div>
</template>

<script>
	import './index.css';
	import imgs from '../lib/assets.js';
	import zmitiUtil from '../lib/util';
	import '../lib/html2canvas';
	import $ from 'jquery';
	import Toast from '../toast/toast';

	export default {
		props:['obserable','randomPv','pv','totalpv'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				show:false,
				toastMsg:'',
				showTitle:false,
				dataList:[],
				viewW:document.documentElement.clientWidth,
				showBtns:false,
				viewH:document.documentElement.clientHeight,
				isChoosed:true,
				hideIds:new Array(56),
				showIdIndex:-1,
				showMasks:false,
				iNow:-1,
				isPress:false,
				currentIndex:-1,
				showTeam:false,

				index:-1,
			
				src:'',
			}
		},
		components:{
			 Toast
		},
		
		methods:{



			playAudio(data,i){
				var {obserable} = this;
				obserable.trigger({
					type:'toggleBgMusic',
					data:false
				})
				
				this.currentIndex = i;
				this.$refs['audio1'][i].play();
			},

			beginChoose(e){

				e.preventDefault();

				var {obserable} = this;
				obserable.trigger({
					type:'toggleBgMusic',
					data:false
				})

				this.isPress = true;
				this.isChoosed = true;
				this.showIdIndex =-1;
				var pressAudio = this.$refs['press'];
				pressAudio.play();
				this.beginChooseTimer =  setInterval(()=>{
					this.index++;
				},70)

				return false;
			},

			play(muted=true,index=this.index){
				this.$refs['audio1'][this.index].currentTime = 0;
				this.$refs['audio1'][this.index].muted = muted;
				this.$refs['audio1'][this.index].play();
			},

			choose(e){
				e.preventDefault();
				var pressAudio = this.$refs['press'];
				pressAudio.currentTime = 0;
				pressAudio.pause();
				this.showIdIndex =-1;
				this.isChoosed = true;
				var {obserable} = this;
				obserable.trigger({
					type:'toggleBgMusic',
					data:false
				})

				this.isPress = false;

				this.index = Math.random()*56|0;
				this.play(true);


				clearInterval(this.beginChooseTimer);

				var countAudio = this.$refs['count'];
				var t = setInterval(()=>{
					this.iNow++;

					countAudio.currentTime = 0;
					countAudio.play();

					if(this.iNow >= this.index){
						countAudio.currentTime = 0;

						clearInterval(t);
						///console.log(this.iNow);
						setTimeout(()=>{
							countAudio.pause();
						},10)
						setTimeout(()=>{

							this.currentIndex = this.iNow;

							setTimeout(()=>{
								this.play(false);
							},200)
						},400)
					}
					if(this.iNow>56){
						this.iNow%=56;
						this.index%=56;
					}
				},100);


				return false;
			},
 


			toast(msg='提交成功',time=2000){
				this.toastMsg = msg;
				setTimeout(()=>{
					this.toastMsg = '';
				},time)
			},

			closeDialog(){
				if(this.currentIndex>-1){
					this.$refs['audio1'][this.currentIndex].currentTime= 0;
					this.$refs['audio1'][this.currentIndex].pause();
				}
				this.currentIndex = this.iNow = this.index = -1;

			},
			
			
			hideMask(){
				
				this.showMasks = false;
			},
			showMask(){
				this.sharePress = false;
				setTimeout(()=>{
					this.showMasks = true;
				},200)
			},
			restart(){
				this.seePress = false;
				setTimeout(()=>{
					window.location.href = window.location.href.split('?')[0];
				},200)
			},
			loadData(){
				$.getJSON('./assets/js/data.json?t='+new Date().getTime(),(data)=>{
					this.dataList = data;
				})
			}
			
			
		},
		mounted(){


			this.loadData();
			var {obserable} = this;


			obserable.on('showIndexApp',(data)=>{
				 this.show = true;
				 var i = 0;
				 var t = setInterval(()=>{
				 	this.showIdIndex = i;
				 	i++;
				 	if(i>=56){
				 		setTimeout(()=>{
				 			this.showIdIndex = -1;
				 			this.isChoosed = true;
				 		},200)
				 		clearInterval(t);
				 	}
				 },40)
			})
		}
	}
</script>

<style scoped="">
	.loading{
            width: 5rem;
            left: 2.5rem;
            height: 40px;
            margin: 0 auto;
            margin-top:40px;
            text-align: center;
            position: absolute;
            top: 6rem;
            z-index: 0;
        }
        .loading span{
            display: inline-block;
            width: 40px;
            height: 100%;
            margin-right: 10px;
            background: #be0000;
            -webkit-animation: load 1.04s ease infinite;
        }
        .loading label{
        	display: block;
        	color:#be0000;
        }
        .loading span:last-child{
            margin-right: 0px; 
        }
        @-webkit-keyframes load{
            0%{
                opacity: 1;
            }
            100%{
                opacity: 0;
            }
        }
        .loading span:nth-child(1){
            -webkit-animation-delay:0.2s;
        }
        .loading span:nth-child(2){
            -webkit-animation-delay:0.4s;
        }
        .loading span:nth-child(3){
            -webkit-animation-delay:0.6s;
        }
        .loading span:nth-child(4){
            -webkit-animation-delay:0.8s;
        }
        .loading span:nth-child(5){
            -webkit-animation-delay:1s;
        }
</style>