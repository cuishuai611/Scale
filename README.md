#移动端Scale刻度尺JavaScript源生canvas渲染插件

在线演示地址：http://www.0317news.cn/git/Scale/

author: Mr Cui（QQ：764028466）

suxingo目录是我的一个demo，着急赶工没有完善js，请以index.html为准，仅供参考，请各位轻拍共勉。

/** 刻度尺插件配置
    conf={

        container : box容器id,            //（必填）

        width : 画布宽度,                 //（必填）

        height: 画布高度,                 //（必填）

        start : 刻度开始值,               //（必填）

        end :   刻度结束值,               //（必填）

        def :   中心线位置,               //（可选）

        unit :  刻度间隔,                 //（可选）

        background : 背景色,              //（可选）

        linecolor : 中心线颜色,           //（可选）

        scaleplate :{                     //刻度样式（可选）

            color : 刻度颜色,             //（可选）

            width : 刻度宽度,             //（可选）

            fontsize: 刻度值字体大小,     //（可选）

            fontcolor: 刻度值字体颜色,    //（可选）
            
            fontfamily: 刻度值字体        //（可选）
        }
    }
*/
