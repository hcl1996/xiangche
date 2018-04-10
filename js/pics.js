var pic=document.querySelector(".pics"),
	list=pic.querySelector("ul"),
	margin=2,
	bigBox=document.querySelector(".bigbox"),
	bigImg=bigBox.querySelector(".bigImg"),
	ind=0,
	len=0,//数据长度
	Dlarge;
init();
//初始化
function init(){
	/*
		1.动态渲染小图
		2.点击小图显示大图
		3.点击大图回到小图
	 */
	setPics();
	clickPic();
	swipe();
}
//动态渲染小图
function setPics(){
	//通过ajax获取数据
	ajax("js/data.json",function(obj){
		//var str="",
		len=obj.length;
			ww=(document.documentElement.clientWidth-margin*2*4)/4
		obj.forEach(function(json,i){
			// str+='<li style="width:'+ww+'px;"><img src="images/'+json.name+'"></li>';
		
		// list.innerHTML=str;
		var linode=document.createElement("li"),
			canvas=document.createElement("canvas");
			list.appendChild(linode);
			linode.appendChild(canvas);
			linode.className="animated zoomIn";
			linode.style.width=ww;
			canvas.width=ww;
			canvas.height=80;
			canvas.id="cvs"+i;
			canvas.setAttribute("large",json.large);
		var cvs=document.getElementById("cvs"+i),
			cvss=cvs.getContext("2d");
		var imgobj=new Image();
		imgobj.onload=function(){
			var x=(this.width-cvs.width)/2,
				y=(this.height-cvs.height)/2;
			cvss.drawImage(this,-x,-y)
		}
		imgobj.src="images/"+json.name;
		})
	})   

}
//点击小图 显示大图
function clickPic(){
	list.addEventListener("click",function(e){
		//显示放大图的大盒子
		bigBox.style.display="block";
		//设置大图的src
		 Dlarge=e.target.getAttribute("large");
		ind=parseInt(Dlarge);
		setSize();
		bigImg.src="images/"+Dlarge;
	})
	bigBox.addEventListener("click",function(){
		this.style.display="none";
	})
}
//滑动上一张 下一张
function swipe(){
	var start,move;
	bigBox.addEventListener("touchstart",function(e){
		start={
			x:e.touches[0].pageX,
			y:e.touches[0].pageY
		}
	})
	bigBox.addEventListener("touchmove",function(e){
		move={
			x:e.touches[0].pageX,
			y:e.touches[0].pageY
		}
	})
	bigBox.addEventListener("touchend",function(){
		var dis={
			x:move.x-start.x,
			y:move.y-start.y
		}
	
		//判断是否是水平移动
		if(Math.abs(dis.x)>50 && Math.abs(dis.x)>Math.abs(dis.y)){
			if(dis.x>0){//右 上一张
				ind--;
				if(ind<0){
					ind=0;
				}
				Dlarge=+ind+".large.jpg";
				bigImg.src="images/"+Dlarge;
				setSize();
			}else{//左 下一张
				ind++;
				if(ind>len){
					ind=len;
				}
				Dlarge=+ind+".large.jpg";
				bigImg.src="images/"+Dlarge;
				setSize();
			}
		}
	})
}
//设置图片的尺寸
function setSize(){
	var imgobj=new Image();
		imgobj.onload=function(){
			bigImg.src="images/"+Dlarge;
			//设置图片的宽高
		var imgw=this.width,
			imgh=this.height;
			//判断是横图还是竖图
			if(imgw>imgh){
				bigImg.style.cssText="width:100%";
			}else{
				bigImg.style.cssText="height:100%";
			}
		}
		imgobj.src="images/"+Dlarge;
}
//请求数据
function ajax(url,callback){
	var xhr=new XMLHttpRequest();
	xhr.open("get",url,true);
	xhr.send(null);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				var data=JSON.parse(xhr.responseText);
				callback(data);
			}
		}
	}

}