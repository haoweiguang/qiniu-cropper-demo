# javascript 裁剪、拖拽图片

使用[cropper](https://github.com/fengyuanchen/cropper)（jquery插件）来裁剪缩放图片，并上传图片到七牛上。

## 图片裁剪
依赖资源

```
cropper.css
cropper.js
jquery-2.1.0.js
```

1、构建html结构

```
<div id="content">
            <form id="NewQyq">
                <div class="SeeCont">
                    <p><span style="color: red;">*</span>选择图片：</p>
                    <div class="SeeImg image_container">
                        <img class="myimg" src='' />
                    </div>
                    <button class="TxText xzBtn" id="imgReplaceBtn" type="button">更换图片   </button>
                    <br />
                    base64地址：<input name="url" id="imgShowurlbase" style="width: 400px;" value="f12打开控制台查看"  />
                    <br />
                    七牛云地址： <input name="url" id="imgShowurl" style="width: 400px;"  />
                </div>
            </form>
        </div>

```

创建函数

```
function upImg(bili){
      $("#imgReplaceBtn").on("click",function(){
                                    $("body").prepend('<div class="parsetcroBox" >'
                                        +'<div class="cropperBox">'
                                            +'<h4 class="boxH4" >图片裁剪 <a class="imgBoxBtn">选择图片 <input type="file" class="file_upload" /></a>  </h4>'
                                            +'<hr />'
                                            +'<div class="imgBox"><img id="preview" src="" /></div>'
                                            +'<div class="imgBoxyulan"><img id="previewyulan" src="" /></div>'
                                            +'<div class="bottomBox">'
                                                +'<button class="imgBoxBtn queding">确定</button>'
                                                +'<button class="imgBoxBtn xuanzhuan">旋转</button>'
                                            +'</div>'
                                         +' </button>'
                                        +'</div>'
                                    +'</div>')
                            })  
}
```

裁切图片主要是以下代码：

```
$img.cropper({
            aspectRatio: bili,         //1 / 1,  //图片比例,1:1
            crop: function (data) {
                var $imgData = $img.cropper('getCroppedCanvas')
                var dataurl = $imgData.toDataURL('image/png');
                $("#previewyulan").attr("src", dataurl)
            },
            built: function (e) {
            }
        });


```

## 七牛云上传base64图片

```
function putb64(picBase){   //七牛云官方文档方法
                                /*picUrl用来存储返回来的url*/
                                var picUrl;
                                /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
                                picBase=picBase.substring(22);
                                /*通过base64编码字符流计算文件流大小函数*/
                                function fileSize(str) {
                                    var fileSize;
                                    if(str.indexOf('=')>0)  {
                                        var indexOf=str.indexOf('=');
                                        str=str.substring(0,indexOf);//把末尾的’=‘号去掉
                                    }
                                    fileSize=parseInt(str.length-(str.length/8)*2);
                                    return fileSize;
                                }
                                /*把字符串转换成json*/
                                function strToJson(str) { 
                                    var json = eval('(' + str + ')'); 
                                    return json; 
                                } 
                                //http://upload-z2.qiniu.com/putb64/ 只适用于七牛云华南空间 因为我的是七牛云华南空间，如果不是华南空间需要根据七牛云文档进行更改
                                var url = "http://upload-z2.qiniu.com/putb64/"+fileSize(picBase);    
                                var xhr = new XMLHttpRequest();
                                xhr.onreadystatechange=function(){
                                    if (xhr.readyState==4){
                                        var keyText=xhr.responseText;
                                        /*返回的key是字符串，需要装换成json*/
                                        keyText=strToJson(keyText);
                                        /* http://image.haoqiure.com/ 是我的七牛云空间网址，keyText.key 是返回的图片文件名*/
                                        picUrl="http://image.haoqiure.com/"+keyText.key;
                                        console.log(picUrl);
                                        $("#imgShowurl").val(picUrl)   //将图片链接显示在输入框去
                                    }
                                }
                                xhr.open("POST", url, true); 
                                xhr.setRequestHeader("Content-Type", "application/octet-stream"); 
                                xhr.setRequestHeader("Authorization", "UpToken "+upImgageToken+""); 
                                xhr.send(picBase);
                             }
```


最后，在页面调用函数并传递需要裁剪的图片比例即可，如下：

```
upImg(1/1)  //裁剪1:1比例的图片
```

效果如下：

![](http://oo501cyv7.bkt.clouddn.com/14930267731412.jpg)



参考：

* [github上的cropper项目](https://github.com/fengyuanchen/cropper)
* [利用cropper插件裁剪本地图片，然后将裁剪过后的base64图片上传至七牛云空间](http://www.cnblogs.com/lamb97/p/6547089.html)
* [cropper项目的中文介绍](http://jqcool.net/image-cropper.html)
* [如何上传base64编码图片到七牛云](https://developer.qiniu.com/kodo/kb/1326/how-to-upload-photos-to-seven-niuyun-base64-code)



