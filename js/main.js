//存储music对象
var musicModels = [];
//初始化Play对象
var player=new Player();

//点击事件
$(".prev").click(function() {
	player.preMusic();
});
$(".pause").click(function() {
	player.pauseMusic();
});
$(".next").click(function() {
	player.nextMusic();
});
getData(); //页面开始执行此方法
//获取json数据,读取json文件
function getData() {
	$.getJSON("pbl.json", function(data) {

		for (var i = 0; i < data.length; i++) {
			var itemMusic = new Music(data[i].src, data[i].img, data[i].num, data[i].musicName, data[i].name);
			musicModels.push(itemMusic);
		}		
		insertData(musicModels);
	})
}
//添加列表数据到页面
function insertData() {	
	for (var i = 0; i < musicModels.length; i++) {
		//创建div
		var div=$("<div class='music' data-index="+i+"></div>"); 
		
		//如果是第一首，默认播放
		if(i==0){
			div.addClass("playing");
		}
		//将div追加到musicbox
		$(".musicbox").append(div);
		//将专辑图片，歌曲名称插入到div
		var img=$("<img src="+  musicModels[i].img  +" />")
		var p=$("<p>"+  musicModels[i].musicName  +"</p>");
		div.append(img);
		div.append(p);
		
		//给每一行添加点击事件
		div.click(function () {
			//更换播放索引
			player.playIndex=$(this).data("index");
			player.playMusic();
			//移除以前的playing:siblings获取到所有同级元素
			$(this).siblings().removeClass("playing");
			//添加playing样式
			$(this).addClass("playing");
			
		});	
	}	
	player.playMusic();
}

//声明音乐对象
function Music(src, img, num, musicName, name) {
	this.src=src;
	this.img=img;
	this.num=num;
	this.musicName=musicName;
	this.name=name;
}

//播放器控制方法
function Player() {
	this.audio=document.getElementById("audio");
	
	this.playIndex=0;
	//暂停
	this.pauseMusic=function () {
		//判断是否是播放状态
		if(audio.paused){
			this.audio.play();
			$(".pause img").attr("src","img/stop.png");
		}else{
			this.audio.pause();
			$(".pause img").attr("src","img/play.png");
		}
	}
	
	//播放
	this.playMusic=function () {
		//更改播放源
		$(this.audio).attr("src",musicModels[this.playIndex].src);
		this.audio.play();
		this.updateRange();
		//更換底部圖片
		$(".pic img").attr("src",musicModels[this.playIndex].img);
		//按了暂停键之后，再点击其他歌曲播放，播放按钮的图片也应该发生相应变化
		$(".pause img").attr("src","img/stop.png");
	}

	//上一首
	this.preMusic=function () {
		if (this.playIndex>0) {
			this.playIndex--;
		} else{
			this.playIndex=9;
		}
		//移除上一個playing
		$(".musicbox .music").siblings().removeClass("playing");
		$(".musicbox .music").eq(this.playIndex).addClass("playing");
		this.playMusic();
	}

	//下一首
	this.nextMusic=function () {
		if (this.playIndex<musicModels.length-1) {
			this.playIndex++;
		} else{
			this.playIndex=0;
		}
		//移除上一個playing
		$(".musicbox .music").siblings().removeClass("playing");
		$(".musicbox .music").eq(this.playIndex).addClass("playing");
		this.playMusic();
		
	}
        
	//进度条的更新
	this.updateRange=function () {
		var $range=$(".range");
		//监听audio的播放进度:ontimeupdate 
		//var interval = setInterval(ontimeupdate, 500);
		this.audio.ontimeupdate=function () {
			//设置input-range值：最大值和当前值
			var current = this.currentTime,
			 duration = this.duration;
			 $range.prop({'max':duration,'value':current});
		}
		
	}

}