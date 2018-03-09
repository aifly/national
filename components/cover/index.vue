<template>
	<div v-tap='entry' v-swipe='entry' :style="{background:'url('+imgs.cover+') no-repeat center center',backgroundSize:'cover'}" class="lt-full zmiti-cover-main-ui "  :class="{'show':show}">
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
					
				},400)
			}
		
			
		},
		mounted(){


			
 

		}
	}
</script>

 