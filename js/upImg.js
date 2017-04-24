function upImg(bili) {
    $("#imgReplaceBtn").on("click", function () {
        $("body").prepend('<div class="parsetcroBox" >'
            + '<div class="cropperBox">'
            + '<h4 class="boxH4" >图片裁剪 <a class="imgBoxBtn">选择图片 <input type="file" class="file_upload" /></a>  </h4>'
            + '<hr />'
            + '<div class="imgBox"><img id="preview" src="" /></div>'
            + '<div class="imgBoxyulan"><img id="previewyulan" src="" /></div>'
            + '<div class="bottomBox">'
            + '<button class="imgBoxBtn queding">确定</button>'
            + '<button class="imgBoxBtn xuanzhuan">旋转</button>'
            + '</div>'
            + ' </button>'
            + '</div>'
            + '</div>')
    })
    //定义一个变量接受从后台返回的uptoken
    var upImgageToken = ''
    //后台获取七牛云token，推荐使用，如果没有使用七牛云存储空间，将base64图片传给后台处理去吧，哈哈
//					$.post($url+'upImgageToken',function(data){   //获取七牛云  token的接口  ，如果需要先上传至七牛云 取消隐藏
//						var data=jQuery.parseJSON(data)
//						upImgageToken=data.data
    //选择图片，将box显示出来
    $(".xzBtn").click(function () {
        $(".parsetcroBox").show()
        $(".imgBoxyulan").height($(".imgBoxyulan").width())
        $.getScript("js/cropper.js")
    })
    //将选择的图片在裁剪区域显示出来
    $("body").on("change", ".file_upload", function () {
        var $file = $(this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        var $img = $("#preview");
        if (fileObj && fileObj.files && fileObj.files[0]) {
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $img.attr('src', dataURL);
        } else {
            dataURL = $file.val();
            var imgObj = document.getElementById("preview");
            imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;

        }
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
        console.log(dataURL)
        $img.cropper('replace', dataURL)
        $(".xuanzhuan").on("click", function () {
            $img.cropper('rotate', 90)
        })

        $("body").unbind("click").on("click", ".queding", function () {

            var $imgData = $img.cropper('getCroppedCanvas')
            var dataurl = $imgData.toDataURL('image/png');  //dataurl便是base64图片
            console.log(dataurl)
            $(".myimg").attr("src", dataurl)
            $(".parsetcroBox").remove()
            imgReplaceBtn = 1
            //下面两种方法需要用到那种使用哪种即可,或者都不使用直接上传base64文件给后台即可，哈哈
            putb64(dataurl)    //上传base64图片上传至七牛云方法，需要先获取到后台生成的上传token
            //blob = dataURLtoBlob(dataurl);   //将base64图片转化为blob文件方法
        })

        function putb64(picBase) {   //七牛云官方文档方法
            /*picUrl用来存储返回来的url*/
            var picUrl;
            /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
            picBase = picBase.substring(22);
            /*通过base64编码字符流计算文件流大小函数*/
            function fileSize(str) {
                var fileSize;
                if (str.indexOf('=') > 0) {
                    var indexOf = str.indexOf('=');
                    str = str.substring(0, indexOf);//把末尾的’=‘号去掉
                }
                fileSize = parseInt(str.length - (str.length / 8) * 2);
                return fileSize;
            }

            /*把字符串转换成json*/
            function strToJson(str) {
                var json = eval('(' + str + ')');
                return json;
            }

            //http://upload-z2.qiniu.com/putb64/ 只适用于七牛云华南空间 因为我的是七牛云华南空间，如果不是华南空间需要根据七牛云文档进行更改
            var url = "http://upload-z2.qiniu.com/putb64/" + fileSize(picBase);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var keyText = xhr.responseText;
                    /*返回的key是字符串，需要装换成json*/
                    keyText = strToJson(keyText);
                    /* http://image.haoqiure.com/ 是我的七牛云空间网址，keyText.key 是返回的图片文件名*/
                    picUrl = "http://image.haoqiure.com/" + keyText.key;
                    console.log(picUrl);
                    $("#imgShowurl").val(picUrl)   //将图片链接显示在输入框去
                }
            }
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.setRequestHeader("Authorization", "UpToken " + upImgageToken + "");
            xhr.send(picBase);
        }

        function dataURLtoBlob(dataurl) {  //将base64格式图片转换为文件形式
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type: mime});
        }

//					var blob = dataURLtoBlob('data:text/plain;base64,YWFhYWFhYQ==');
    });
}
//			})

