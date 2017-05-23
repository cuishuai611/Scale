/** 刻度尺插件配置
	conf={
		container : box容器id,
		width : 画布宽度,
		height: 画布高度,
		start : 刻度开始值,
		end : 	刻度结束值,
		def :   中心线位置,
		unit :  刻度间隔,
		background : 背景色,
		linecolor : 中心线颜色,
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
    if(c.container == undefined){
    	console.log('请设置元素id');return;
    };
    if(c.scaleplate == undefined) { c.scaleplate={}; };
    if(c.scaleplate.color == undefined) { c.scaleplate.color = '#f00';};                 //刻度颜色
    if(c.scaleplate.width == undefined) { c.scaleplate.width = 1;};                      //刻度宽度
    if(c.scaleplate.fontsize == undefined) { c.scaleplate.fontsize = 12;}                //刻度值字体大小
    if(c.scaleplate.fontcolor == undefined) { c.scaleplate.fontcolor = '#f00';};         //刻度值字体颜色
    if(c.scaleplate.fontfamily == undefined) { c.scaleplate.fontfamily = 'Courier New';};//刻度值字体样式
    c.unit = c.unit==undefined ? 5 : c.unit;                        //刻度间隔，默认值5
    c.def = c.def==undefined ? c.start : c.def;                     //中心线位置，默认值为开始值
    c.background = c.background==undefined ? '#fff' : c.background; //画布背景色，默认白色
    c.linecolor = c.linecolor==undefined ? '#000' : c.linecolor;    //中心线颜色，默认黑色 
    var outerArguments = arguments;
	if(outerArguments[1] != undefined && typeof(outerArguments[1]) == 'function'){
       outerArguments[1](c.def);
    }
    var box = document.getElementById(c.container);
    var canvas = document.createElement('canvas');
    canvas.id = 'Scaleplate';
    canvas.width = c.width;
    canvas.height = c.height;
    box.appendChild(canvas); 
    if(canvas.getContext){    //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
    	var Scanvas = document.createElement('canvas'); //创建刻度画布
    	Scanvas.height = c.height;
    	var mid; 
    	if(c.end < c.start){ 
            mid = c.end; c.end = c.start; c.start = mid;
    	}
    	c.end++;
    	mid = c.end - c.start;//取值范围    	
    	var capacity = 1; //刻度容量
    	switch(true){
    		case mid>0 && mid<=1000 : capacity = 1;
    		break;
    		case mid>1000 && mid<=10000 : capacity = 10;
    		break;     
            case mid>10000 : capacity = 100;
            break;
    	}
    	var space = capacity*10; //左右两边间隙，根据该值计算整数倍刻度值画线
    	Scanvas.width = c.unit*Math.ceil(mid/capacity)+2*space; //加两边左右间隙是方便渲染最后刻度值
    	var ctx = Scanvas.getContext('2d');
    	ctx.lineWidth = c.scaleplate.width;
        for(var i=0; i<Math.ceil(mid/capacity); i++){
        	ctx.beginPath();
            if((i*capacity+c.start)%(space*capacity) == 0){
                ctx.moveTo(i*c.unit+space,Math.ceil(c.height*3/4));
            }else if((i*capacity+c.start)%(space/2*capacity) == 0){
            	ctx.moveTo(i*c.unit+space,Math.ceil(c.height*5/6));
            }else{
            	ctx.moveTo(i*c.unit+space,Math.ceil(c.height*8/9));
            }
            ctx.lineTo(i*c.unit+space,c.height);
            ctx.strokeStyle = c.scaleplate.color;
            ctx.stroke();     //实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
            ctx.closePath();  //关闭当前的绘制路径
            if((i*capacity+c.start)%(space*capacity) == 0){
            	ctx.font = c.scaleplate.fontsize+'px '+c.scaleplate.fontfamily; //设置文本的字体大小和字体样式
            	ctx.fillStyle = c.scaleplate.fontcolor;
            	if(i*capacity+c.start >= 100){
                    ctx.fillText((i*capacity+c.start), (i*c.unit+space-Math.ceil(c.scaleplate.fontsize-2)), (Math.ceil(c.height*9/10)-c.scaleplate.fontsize));
            	}else{
            	    ctx.fillText((i*capacity+c.start), (i*c.unit+space-Math.ceil(c.scaleplate.fontsize/2)), (Math.ceil(c.height*9/10)-c.scaleplate.fontsize));
            	}
            }
        }
        ctx = canvas.getContext('2d');
        ctx.fillStyle = c.background;
        ctx.fillRect = (0,0,c.width,c.height);
        ctx.lineWidth = c.scaleplate.width;
        ctx.moveTo(Math.floor(c.width/2),0);
        ctx.lineTo(Math.floor(c.width/2),c.height);
        ctx.strokeStyle = c.linecolor;
        ctx.stroke();
        ctx.closePath();

        //绘制第一个canvas底部线
        var fctx = canvas.getContext('2d');
        fctx.moveTo(0,c.height);
        fctx.lineTo(c.width,c.height);
        fctx.strokeStyle = c.scaleplate.color;
        fctx.stroke();
        fctx.closePath();

        var image = Scanvas.toDataURL('image/png');
        var img = document.createElement('img');
        var defX = Math.floor(c.width/2)-((c.def-c.start)*capacity*c.unit+space);//初始化开始位置
        img.onload = function(){
        	ctx.drawImage(img,defX,0);
        }
        img.src = image;
        var initial = canvas.toDataURL('image/png');
        var initial_img = document.createElement('img');
        initial_img.src = initial;

        var x,now,moveDistance;
        //添加手指触碰屏幕时的touchstart事件
        canvas.addEventListener('touchstart',function(e){
        	e.stopPropagation();
        	e.preventDefault();
        	x = e.touches[0].clientX;  //获取第一个手指对象的X轴坐标值
        },false);
        //添加手指滑动屏幕时的touchmove事件
        canvas.addEventListener('touchmove',function(e){
        	e.stopPropagation();
        	e.preventDefault();
        	nowx = e.touches[0].clientX;
            moveDistance = nowx - x;
            x = nowx;
            defX += moveDistance;
            now = (Math.floor(c.width/2)-defX-space)*capacity/c.unit + c.start;//获取当前刻度值
            now = Math.round(now);
            if((now<c.start) || now>(c.end-1)){  //判断临界值情况
				if (now<c.start) { 
					now = c.start; 
					defX = Math.floor(c.width/2)- space;
				}
				if (now>(c.end-1)) { 
					now = c.end-1; 
					defX = Math.floor(c.width/2)-((c.end-1-c.start)*capacity*c.unit+space);
				}
			}
            drawImg(img,Math.floor(c.width/2)-((now-c.start)*c.unit/capacity+space),0);
            if(outerArguments[1] != undefined && typeof(outerArguments[1]) == 'function'){
            	outerArguments[1](now);
            }
        },false);
    }

    function drawImg(imgdata,x,y){  //touchmove事件后，时时重新渲染
    	ctx.clearRect(0,0,c.width,c.height);
    	ctx.drawImage(imgdata,x,y);
    	ctx.drawImage(initial_img,0,0);
    }
}
