<template>
	<div v-tap='entry' v-swipe='entry' :style="{background:'url('+imgs.cover+') no-repeat center center',backgroundSize:'cover'}" class="lt-full zmiti-cover-main-ui "  :class="{'show':show}">

		<div class="zmit">
			
		</div>
		<div class="zmiti-title">
			<img :src="imgs.play" />

			
		</div>

		<div class="zmiti-pomegranate">
			<img :src="imgs.pomegranate" />
		</div>

	</div>
</template>

<script>
	import './index.css';
	import imgs from '../lib/assets.js';
	import zmitiUtil from '../lib/util';
	
	import $ from 'jquery';
	import Toast from '../toast/toast';

	export default {
		props:['obserable','randomPv','pv','totalpv'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				show:true ,
				toastMsg:'',
				showTitle:false,
				text:'各民族要相互了解、相互尊重、相互包容、相互欣赏、相互学习、相互帮助，像石榴籽那样紧紧抱在一起。',

				viewW:document.documentElement.clientWidth,
				viewH:document.documentElement.clientHeight,
				showMasks:false,
				showLoading:false,
				
			}
		},
		components:{
			 Toast
		},
		
		methods:{
			
			entry(){
				var {obserable} = this;
				obserable.trigger({
					type:'showIndexApp'
				})
				this.show =false;	
				setTimeout(()=>{

					obserable.trigger({
						type:'setPlay',
						data:{
							top:'-4rem'
						}
					})
					
				},400)
			}
		
			
		},
		mounted(){


			
 

		}
	}
</script>

 