/** 刻度尺插件配置
	conf={
		container : box容器id,
		width : 画布宽度,
		height: 画布高度,
		start : 刻度开始值,
		end : 	刻度结束值,
		def :   中心线位置,
		unit :  刻度间隔,
		space : 左右空隙,
		background : 背景色,
		scaleplate :{//刻度样式
			color : 刻度颜色，
			width : 刻度宽度.
			fontsize: 刻度值字体大小,
			fontcolor: 刻度值字体颜色,
			fontfamily: 刻度值字体
		}
	}
*/
function Scaleplate(c){
	if (c.container==undefined) {
		console.log('请设置元素id');return;
	};
	if (c.scaleplate == undefined) { c.scaleplate={}; };
	if (c.scaleplate.color == undefined) { c.scaleplate.color = "#c3c3c3"; };//刻度颜色
	if (c.scaleplate.width == undefined) { c.scaleplate.width = 1; };//刻度宽度
	if (c.scaleplate.fontsize == undefined) { c.scaleplate.fontsize = 12; };//刻度值字号
	if (c.scaleplate.fontcolor == undefined) { c.scaleplate.fontcolor = "#c3c3c3"; };//刻度值颜色
	if (c.scaleplate.fontfamily == undefined) { c.scaleplate.fontfamily = "Courier New"; };//刻度值字体
	if (c.background == undefined) { c.background = "#fff"; };//画布底色
	c.space = c.space == undefined ? 10 : c.space;
	c.unit = c.unit == undefined ? 5 : c.unit;
	c.def = c.def == undefined ? c.start : c.def;
	c.end++;
	var outerArguments = arguments;
	var box = document.getElementById(c.container);
	var canvas = document.createElement('canvas');
	canvas.id     = "Scaleplate"; 
	canvas.width  = c.width; 
	canvas.height = c.height;
	box.appendChild(canvas);
	if(canvas.getContext){    //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
		var Scanvas = document.createElement('canvas');//刻度画布
		Scanvas.height = c.height;
		var ctx = Scanvas.getContext("2d");
		if (c.end < c.start) {//开始值大于结束值的情况
			var mid = c.end; c.end = c.start; c.start = mid;
		};
		mid = c.end-c.start;//取值范围
		var unit = c.unit,  //刻度间隔
		 	capacity = 1;   //刻度容量
		switch(true){
			case mid>0 && mid<=1000:
				capacity = 1;
			break;
			case mid>1000 && mid<=10000:
				capacity = 10;
			break;
			case mid>10000:
				capacity = 100;
			break;
		}
		
		Scanvas.width = unit*Math.ceil(mid/capacity)+2*c.space;//设置刻度尺的宽度
		ctx.lineWidth = c.scaleplate.width;
		for(var i=0; i<Math.ceil(mid/capacity); i++){
            ctx.beginPath();
            if ((i*capacity+c.start)%(c.space*capacity)==0) {
            	ctx.moveTo(i*unit+c.space, Math.ceil(c.height*3/4));
            }else if((i*capacity+c.start)%(5*capacity)==0){
            	ctx.moveTo(i*unit+c.space, Math.ceil(c.height*5/6));
            }else{
            	ctx.moveTo(i*unit+c.space, Math.ceil(c.height*8/9));
            }
            ctx.lineTo(i*unit+c.space, c.height);
            ctx.strokeStyle = c.scaleplate.color;//设置图形颜色
            ctx.stroke();   //实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
            ctx.closePath();//关闭当前的绘制路径
            if ((i*capacity+c.start)%(c.space*capacity)==0) {//刻度值
            	ctx.font = c.scaleplate.fontsize+'px '+c.scaleplate.fontfamily; //设置文本的字体大小和字体样式
            	ctx.fillStyle = c.scaleplate.fontcolor;
            	if(i*capacity+c.start >= 100){
                    ctx.fillText((i*capacity+c.start), (i*unit+c.space-Math.ceil(c.scaleplate.fontsize-2)), (Math.ceil(c.height*9/10)-c.scaleplate.fontsize));
            	}else{
            	    ctx.fillText((i*capacity+c.start), (i*unit+c.space-Math.ceil(c.scaleplate.fontsize/2)), (Math.ceil(c.height*9/10)-c.scaleplate.fontsize));
            	}
            }
        }
        var image = Scanvas.toDataURL("image/png");
        var img = document.createElement('img');
        

        //把绘出的刻度放到主画布上
        ctx = canvas.getContext("2d");
        ctx.fillStyle = c.background;
        ctx.fillRect(0,0,c.width,c.height);
        ctx.lineWidth = 1;
        ctx.moveTo(Math.floor(c.width/2), 0);
        ctx.lineTo(Math.floor(c.width/2), c.height);
        ctx.strokeStyle = '#f00';//绘制一条中间线
        ctx.stroke(); //沿着坐标点顺序的路径绘制直线
        ctx.closePath();//关闭当前的绘制路径

        //绘制第一个外层cavans对象的底部线
		var fcxt = canvas.getContext("2d");
		fcxt.beginPath();
        fcxt.moveTo(0, c.height);
        fcxt.lineTo(c.width, c.height);
        fcxt.strokeStyle = c.scaleplate.color;
        fcxt.stroke();
        fcxt.closePath();//底部线绘制结束关闭当前路径

        var initial = canvas.toDataURL("image/png");
        var initial_img = document.createElement('img');
        initial_img.src = initial;
        var defX = Math.floor(c.width/2)-((c.def-c.start)*capacity*unit+c.space);
        img.onload = function(){
        	ctx.drawImage(img,defX,0);
        }
        img.src = image;
        var x,now;
        //添加手指触碰屏幕时发生的监听事件。
		canvas.addEventListener('touchstart',function(e){
			e.stopPropagation();
			e.preventDefault();
			var touch =e.touches[0];//手指事件只有一个手指
			x = Number(touch.clientX);//获取手指落下的x坐标
		},false);
		//添加手指移动的监听事件。
	    canvas.addEventListener('touchmove',function(e){
			e.stopPropagation();
			e.preventDefault();
			nowx = Number(e.touches[0].clientX);
			var moveDistance = nowx-x;
			x = nowx;
			defX+=moveDistance;
            //时刻获取当前刻度值
        	now = (Math.floor(c.width/2)-defX-c.space)*capacity/unit+c.start;
		    now = Math.round(now);
			if((now<c.start) || now>(c.end-1)){
				if (now<c.start) { now=c.start; defX = Math.floor(c.width/2)-((c.def-c.start)*capacity*unit+c.space);};
				if (now>(c.end-1)) { now=c.end-1; defX = Math.floor(c.width/2)-((c.end-1-c.def)*capacity*unit+c.space);};
			}
			drawImg(img,Math.floor(c.width/2)-((now-c.start)*unit/capacity+c.space),0);
            if (outerArguments[1]!=undefined && typeof(outerArguments[1])=='function') {
				outerArguments[1](now);
			}
		},false);
	}

	function drawImg(imgData,x,y){
		ctx.clearRect(0,0,c.width,c.height);
		ctx.drawImage(initial_img,0,0);
		ctx.drawImage(imgData,x,0);
	}
}

//
$(document).ready(function(){
	$('#storemoney').click(function(){
		CheckDate();
	});
	$('.descp').click(function(){
        $('.synopsispanel').addClass('showthis');
	});
	$('.close').click(function(){
        ClosePanel($(this),'showthis');
	});
	$('.confirmgo').click(function(){
		CheckLogin($(this),'showthis');
	})
	$('.confirmyy').click(function(){
		ClosePanel($(this),'showthis');
		ConfirmMsg();
	});
	$('.seemyse').click(function(){
		ClosePanel($(this),'showthis');
		$('.myreservepanel').addClass('showthis');
		GetReserveList();
	})
	$('.myreserve').click(function(){
		$(this).text() == 0 ? ShowEsg('您还没有预约') : $('.myreservepanel').addClass('showthis');GetReserveList();
	})
	$('.myreservepanel').click(function(){
		$(this).removeClass('showthis');	
	})
	$('.overbox').click(function(e){
		e.stopPropagation();
	})
})

function CheckDate(){
	var SumMoney = $('input[name=tzquota]').val(),
	    SumDays = ShowVale.innerText;
    $.post(
    	'ceshi.php',
    	{SumMoney:SumMoney,SumDays:SumDays},
    	function(res){
            if(res.resultCode == 1){
            	$('.loginpanel').addClass('showthis');
            }else if(res.resultCode == 2){
            	ShowEsg('请先实名认证！');
            }else if(res.resultCode == 3){
                $('.confirmpanel').addClass('showthis');
                var NowDay = GetDay();
                $('.quota').text(SumMoney);
                $('.interestrate').text(res.dataa.InterestRate+'.0%');
                $('.addrate').text('+'+res.dataa.AddRate+'0%');
                $('.sumdays').text(SumDays);
                $('.gainval').text(res.dataa.Income);
                $('.applytime').text(NowDay);
            }else{
                ShowEsg('Error：系统错误')
            }
    	},
    	'json'
    );
}
//登录验证
function CheckLogin(o,c){
    var UserPhone = $('input[name=username]').val(), UserPsd = $('input[name=userpsd]').val();
    if($.trim(UserPhone) == '' || $.trim(UserPhone).length<11) {ShowEsg('请输入正确的手机号码');return false;}
    if($.trim(UserPsd) == '') {ShowEsg('请输入密码');return false;}
    $.post(
        '', 
        {'username':UserPhone,'userpsd':UserPsd}, function(res){
            if(res == 1) {
            	$('.pre_user').addClass('hadlogin');
            	ClosePanel(o,c); 
            	$('.confirmpanel').addClass(c);
            }else{
            	ShowEsg('输入手机号或密码错误');return false;
            }
        }
    ).error(function(){ShowEsg('网络参数错误')});
}
//确认是否预约
function ConfirmMsg(){
    $.post(
       'confirm.php',
       {'confirm':'yes'},
       function(result){
	       	if(result == 1){
	       	   $('.reservepanel').addClass('showthis');
	        }else{
	        	ShowEsg('运行错误');
	        }
       }
    ).error(function(){ShowEsg('网络参数错误')});
}
//获取预约信息
function GetReserveList(){
	$.ajax({
		url   : 'cslistdata.php',
		type  : 'POST',
		dataType : 'json',
		cache : 'false',
		success : function(res){
			if(res.length <= 1){
				$('.overbox').css({'height':'auto'})
			}
			for(var i=0;i<res.length;i++){
				var listdata = "<div class='yuyuebox'>"+
	    		                     "<div class='yuyuetit'><span>我的预约"+res[i].ReserveNum+"</span></div>"+
						    		 "<div class='parameter'>"+
						    			"<dl><dt>投资金额：</dt><dd><span>"+res[i].ReserveSum+"</span>元</dd></dl>"+
						    			"<dl><dt>年化收益：</dt><dd><span>"+res[i].ReserveRate+".0%</span><i>+"+res[i].Reservejxi+"0%</i></dd></dl>"+
						    		"</div>"+
						    		"<div class='income'>"+
						    			"<dl class='clearfix'><dt>理财期限：</dt><dd><span>"+res[i].ReserveDay+"</span>天</dd></dl>"+
						    			"<dl class='clearfix'><dt>预期到期收益：</dt><dd><span>"+res[i].ReserveGain+"</span>元</dd></dl>"+
						    		"</div>"+
						    		"<p class='yytime'>申请日期：<time>"+res[i].ReserveDate+"</time></p>"+
						    		"<p class='prompt'>*请保持手机畅通<br>我们将在24小时之内与您联系</p>"+
						    	"</div>";
			    $('.overbox').html(listdata);
			}
		}
	})
}

function ClosePanel(o,c){
    var ParentNode = o.parents('.'+c);
    ParentNode.removeClass(c);
}

function GetDay(){
	var NowData = new Date(),
	    Year    = NowData.getFullYear(),
	    Month   = NowData.getMonth()+1,
	    Days    = NowData.getDate();
    return Year+'年'+Month+'月'+Days+'日';	
}

//弹层模块
function ShowEsg(obj){	
	var mylayer = $('<span class=mylayer>'+obj+'</span>');
	$('body').append(mylayer);
	var layerW = $('.mylayer').outerWidth(),  layerH = $('.mylayer').outerHeight(), t = null;
	$('.mylayer').css({'opacity':1,'margin-left':-layerW/2+'px','margin-top':-layerH/2+'px'});
	t = setTimeout(function(){
        $('.mylayer').remove();
        clearTimeout(t);
    },2000);
}

window.onload = function(){
	var MyListRes = document.querySelector('.myreservepanel');
	MyListRes.addEventListener('touchmove',function(e){
		e.stopPropagation();
		// e.preventDefault();
	},false);
}