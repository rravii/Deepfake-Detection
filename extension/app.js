var imageManager = {
    imageType: {
        IMG: "IMG",
        TEXT: "TEXT",
        LINK: "LINK",
        INPUT_IMG: "INPUT_IMG",
        BACKGROUND: "BACKGROUND"
    },
    imgList: [],
    getImages: function () {
        this.imgList = [];
        var imgs = document.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            var newImg = new Image();
            newImg.src = img.src;
            var width = 0
                , height = 0;
            width = parseInt(img.naturalWidth);
            height = parseInt(img.naturalHeight);
            nwidth = parseInt(newImg.width);
            nheight = parseInt(newImg.height);
            width = nwidth > width ? nwidth : width;
            height = nheight > height ? nheight : height;
            if (height > 100 && width > 100){
                this.addImg(imageManager.imageType.IMG, img.src, width, height)
            }
        }

        return this.imgList
    },
    addImg: function (d, f, c, a) {
        this.imgList.push({
            type: d,
            src: f,
            width: c,
            height: a
        })
    },
    getUniqueImagesSrcs: function () {
        var images = imageManager.getImages();
        var imagesStrArray = new Array();
        for (var i = 0; i < images.length; i++) {
            imagesStrArray[imagesStrArray.length] = images[i].src;
        }
        var uniques = imagesStrArray.reverse().filter(function (e, i, arr) {
            return arr.indexOf(e, i + 1) === -1;
        }).reverse();
        return uniques;
    },

};
var result = {
    images: imageManager.getUniqueImagesSrcs(),
    title: document.title,
    isTop: window.top == window.self,
    origin: window.location.origin
}
result