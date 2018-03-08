<template>
	<div  class="lt-full zmiti-index-main-ui "  :class="{'show':show}">
		<div class="zmiti-index-main">
			<div class="zmiti-index-title1">
				<img :src="imgs.title1" alt="">
			</div>

			<div class="zmiti-nation-list"></div>
		</div>

		<div v-if='showMasks' @touchstart='hideMask' class="zmiti-mask" :style="{background: 'url('+imgs.arrow1+') no-repeat center top',backgroundSize:'cover'}">
			
		</div>

		<Toast :msg='toastMsg'></Toast>
	</div>
</template>

<script>
	import './index.css';
	import imgs from '../lib/assets.js';
	import zmitiUtil from '../lib/util';
	import '../lib/html2canvas';
	import $ from 'jquery';
	import Toast from '../toast/toast';

	import IScroll from 'iscroll';
	export default {
		props:['obserable','randomPv','pv','totalpv'],
		name:'zmitiindex',
		data(){
			return{
				imgs,
				show:true,
				toastMsg:'',
				showTitle:false,
				viewW:document.documentElement.clientWidth,
				showBtns:false,
				viewH:document.documentElement.clientHeight,
				
				showMasks:false,
				
			
				src:'',
			}
		},
		components:{
			 Toast
		},
		
		methods:{
			like(item,index){
				if(this.commentList[index].isLike){
					this.toast("您已经点过赞啦~");
					return;
				}
				var s = this;

				 $.ajax({
                    url: 'http://api.zmiti.com/v2/h5/click_hymn/',
                    type: 'post',
                    async: false,
                    data: {
                        qid: item.qid,
                    },
                    success: function(data) {
                        //console.log(data,'提交成功');
                        if (data.getret === 0) {
                            //列表
                            s.addIndex = index;
                            s.getCommentList(()=>{
                            	s.commentList[index].isLike = true;
                            });



                        }
                    }
                });
			},
			toast(msg='提交成功',time=2000){
				this.toastMsg = msg;
				setTimeout(()=>{
					this.toastMsg = '';
				},time)
			},
			
			openDialog(){
				this.showDialog = true;
			},
			numstart(){
				//this.num =  1;
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
			afterEnter(){
				this.showBtns = true;
			},
			html2img(){
				var s = this;
				var {obserable} = this;

				this.scroll.scrollTo(0,0,0);
				//document.title = '开始截图....'
				setTimeout(()=>{
					this.showLoading = true;
					var ref = 'zmiti-cache-page';
					var dom = this.$refs[ref];
					html2canvas(dom,{
						useCORS: true,
						onrendered: function(canvas) {
					        var url = canvas.toDataURL();
					        $.ajax({
					          //url: window.protocol+'//api.zmiti.com/v2/share/base64_image/',
					          url:window.protocol+'//'+window.server+'.zmiti.com/v2/share/base64_image/',
					          type: 'post',
					          data: {
					            setcontents: url,
					            setwidth: dom.clientWidth,
					            setheight:dom.clientHeight
					          },
					          success: function(data) {
					          	//alert('data.getret =>'+data.getret)
					          	//document.title = '截图成功....'
					            if (data.getret === 0) {
					            	//s.deleteImg(dt.img);

					              var src = data.getimageurl;
					             	
					             	var img = new Image();
					             	img.onload = function (argument) {
					             		// body...
					             		s.createImg = src;
					             		s.showBtns = true;
					             		s.showLoading = false;

					             		setTimeout(()=>{
					             			//document.title=s.viewH+','+(s.$refs['createimgs'].offsetHeight*1.2)
											s.$refs['createimgs'].style.WebkitTransform = 'scale('+s.viewH/(s.$refs['createimgs'].offsetHeight*1.2)+')'

										},100)
					             	};
					             	img.src =src;
	
									var url = window.location.href.split('#')[0];



									

									url = zmitiUtil.changeURLPar(url,'src',src);

									zmitiUtil.wxConfig(window.zmitiConfig.shareTitle.replace(/{{totalPv}}/ig, s.totalpv),
							window.zmitiConfig.shareDesc.replace(/{{periods}}/ig, s.periodsUpper[window.zmitiConfig.periods - 1]).replace(/{{pv}}/ig, s.randomPv),url);
								       
					            }

					          }
					        })

					      },
					      width: dom.clientWidth,
					      height:dom.clientHeight
					})
				},100)
			},
			
			
		},
		mounted(){

			var {obserable} = this;


			var a = [];

			for(var i=0;i<56;i++){
				a.push(i);
			}

			var b = [];
			for(var k=0;k<7;k++){
				b.push(a.concat([]).slice(k*8,(k+1)*8))
			}

			console.log(b)



			obserable.on('showIndexApp',(data)=>{
				this.show = true;
				if(data){
					var s = this;
					this.createImg = data.src;
					this.src = data.src;

					setTimeout(()=>{
						this.$refs['createimgs'].style.WebkitTransform = 'scale('+this.viewH/2000+')'
					},10);

					var url = window.location.href.split('#')[0];
						url = zmitiUtil.changeURLPar(url,'src',this.src);

						zmitiUtil.wxConfig(window.zmitiConfig.shareTitle.replace(/{{totalPv}}/ig, s.totalpv),
							window.zmitiConfig.shareDesc.replace(/{{periods}}/ig, this.periodsUpper[window.zmitiConfig.periods - 1]).replace(/{{pv}}/ig, s.randomPv),url);
				}
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