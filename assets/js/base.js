var imgs = {
	play: './assets/images/play1.png',
	play2: './assets/images/play.png',
	teamBtn: './assets/images/team-btn.png',
	logo: './assets/images/logo.png',
	pomegranate: './assets/images/pomegranate.png',
	//title: './assets/images/title.png',
	cover: './assets/images/cover.jpg',
	team: './assets/images/team.jpg',
	title1: './assets/images/title2.jpg',
	arrow1: './assets/images/arron1.png',
	imgBg: './assets/images/img-bg.png',
}

var arr = [];
for (var attr in imgs) {
	arr.push(imgs[attr]);
}
for (var i = 1; i < 57; i++) {
	arr.push('./assets/images/' + i + '.jpg');
}
var loading = function(arr, fn, fnEnd) {
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
}