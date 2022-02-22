var conf = {
    defaults: {
        minwidth: 0,
        minheight: 0,
        // downloadseparatefolder:false,
        // downloadfolderpref:"basedonurl",
        savefoldername: "scanimg",
        donotbother: false,
        numviews: 0,
        allframes: false,
        biggerview: false,
        twocols: false,
        newshown1: false,
        hidetools: false,
        savesize: false,
        sizetype: "any"
    },
    minwidth: 0,
    minheight: 0,
    urlpattern: "",
    // downloadseparatefolder:false,
    // downloadfolderpref:"basedonurl",
    savefoldername: "scanimg",
    donotbother: false,
    changed: false,
    allframes: false,
    biggerview: false,
    twocols: false,
    newshown1: false,
    hidetools: false,
    savesize: false,
    sizetype: "any"
}
var scanimg = {
    darkmode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
    imageCT: new Object(),
    selection: new Object(),
    allimages: new Object(),
    stats: {
        types: {},
        sizes: {}
    },
    getImages: function (onlyTopFrame) {
        scanimg.initiated = false;
        var allFrames = conf.allframes;
        if (allFrames)
            allFrames = !onlyTopFrame;
        scanimg.allimages = new Object();
        //scanimg.monitorStatus(onlyTopFrame);
        //reset old results
        var ihtml = '<div id="spinner" class="spinner"><span id="processedImages" style="position: absolute;top: -38px;left: 50%;transform:translateX(-50%);white-space:nowrap;"></span><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
        if ($("#imgsContainer")[0].innerHTML.trim() != ihtml) {
            $("#imgsContainer")[0].innerHTML = ihtml;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            scanimg.currUrl = tabs[0].url;
            chrome.tabs.executeScript(tabs[0].id, { file: "app.js", allFrames: allFrames }, scanimg.getImagesCallback)
        })
    },
    getImagesCallback: function (results) {
        if (scanimg.initiated)
            return
        console.log(results);
        scanimg.initiated = true;
        if (chrome.extension.lastError || !results) {
            var message = chrome.extension.lastError ? chrome.extension.lastError.message : "Cannot access images in this page."
            if (message.indexOf("The extensions gallery cannot be scripted") != -1 || message.indexOf("Missing host permission for the tab") != -1) {
                //$("#imgsContainer")[0].style.background="linear-gradient(#31388d,#753fa9,#ff0762,#f25632)";
                //$("#imgsContainer")[0].style.color="#fff";
                $("#imgsContainer")[0].style.padding = "0px 20px";
                $("#imgsContainer")[0].style.position = "relative";
                message = '<div style="width:387px;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 201.526 201.526" style="enable-background:new 0 0 512 512;width: 65px;height: 65px;float: left;" xml:space="preserve" class=""><g><path d="M191.125,11.403H10.4C4.666,11.403,0,16.068,0,21.805v59.108c0,5.738,4.666,10.404,10.4,10.404h180.726     c5.734,0,10.4-4.666,10.4-10.403V21.805C201.525,16.068,196.86,11.403,191.125,11.403z M194.577,80.914h-0.001     c0,1.903-1.547,3.454-3.451,3.454H10.4c-1.904,0-3.451-1.551-3.451-3.454V21.805c0-1.903,1.547-3.454,3.451-3.454h180.726     c1.903,0,3.451,1.551,3.451,3.454V80.914z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M63.924,35.968c-1.751-0.801-3.807-0.027-4.605,1.714L48.821,60.606l-3.19-6.696l6.109-13.338     c0.797-1.744,0.034-3.807-1.714-4.605c-1.751-0.801-3.811-0.027-4.605,1.714l-3.687,8.051l-3.859-8.099     c-0.825-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l6.358,13.347l-3.04,6.638l-10.947-22.97     c-0.821-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l14.143,29.686c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l3.716-8.113l3.888,8.161c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l13.596-29.686C66.434,38.83,65.671,36.766,63.924,35.968z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M122.991,35.968c-1.754-0.801-3.807-0.027-4.605,1.714l-10.498,22.924l-3.19-6.696l6.109-13.338     c0.797-1.744,0.034-3.807-1.714-4.605c-1.751-0.801-3.807-0.027-4.604,1.714l-3.687,8.051l-3.859-8.099     c-0.821-1.734-2.891-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l6.358,13.347l-3.04,6.638l-10.947-22.97     c-0.821-1.734-2.891-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l14.143,29.686c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l3.716-8.113l3.888,8.161c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l13.596-29.686C125.502,38.83,124.739,36.766,122.991,35.968z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M182.059,35.968c-1.751-0.801-3.807-0.027-4.605,1.714l-10.498,22.924l-3.19-6.696l6.109-13.338     c0.797-1.744,0.034-3.807-1.714-4.605c-1.751-0.801-3.807-0.027-4.605,1.714l-3.687,8.051l-3.859-8.099     c-0.821-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l6.358,13.347l-3.04,6.638l-10.946-22.971     c-0.821-1.734-2.888-2.477-4.628-1.642c-1.734,0.825-2.47,2.898-1.642,4.628l14.143,29.686c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l3.716-8.113l3.888,8.161c0.573,1.211,1.795,1.982,3.135,1.982     c0.01,0,0.017,0,0.027,0c1.347-0.01,2.569-0.801,3.132-2.029l13.596-29.686C184.57,38.83,183.806,36.766,182.059,35.968z" fill="#333333" data-original="#000000" style="" class=""></path><path d="M183.461,140.316L130.3,97.208c-1.065-0.865-2.545-1.018-3.766-0.397c-1.222,0.621-1.965,1.907-1.893,3.278l3.627,68.345     c0.078,1.455,1.055,2.708,2.45,3.139c1.384,0.421,2.904-0.061,3.787-1.222c0.065-0.081,5.398-7.075,11.231-12.901l15.68,30.776     c0.417,0.821,1.143,1.442,2.022,1.727c0.35,0.112,0.713,0.17,1.072,0.17c0.543,0,1.086-0.129,1.578-0.38l12.385-6.311     c0.821-0.417,1.442-1.143,1.727-2.022c0.285-0.876,0.21-1.829-0.21-2.65l-15.68-30.772c8.14-1.293,16.932-1.5,17.037-1.5     c1.455-0.034,2.742-0.97,3.213-2.348C185.031,142.759,184.594,141.232,183.461,140.316z M158.337,142.055     c-1.045,0.238-1.92,0.943-2.375,1.914c-0.451,0.97-0.434,2.097,0.054,3.05l16.206,31.8l-6.192,3.156l-16.206-31.804     c-0.485-0.953-1.384-1.632-2.436-1.832c-0.217-0.044-0.438-0.065-0.658-0.065c-0.831,0-1.646,0.298-2.283,0.859     c-3.444,3.003-6.926,6.756-9.715,9.972l-2.734-51.576l40.117,32.53C167.876,140.426,162.793,141.037,158.337,142.055z" fill="#333333" data-original="#000000" style="" class=""></path></g></svg><div style="float: left;padding-left: 15px;width:300px;">Visit a website and you will be able to find and download all the images...</div></div>'
            }
            var errordiv = document.createElement("div");
            errordiv.innerHTML = "<div style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);'>" + message + "</center>";
            errordiv.style.width = "100%";
            errordiv.style.height = "100%";
            $("#imgsContainer")[0].appendChild(errordiv);
            document.getElementById("spinner").style.display = "none";
            document.getElementById("searchingimages").style.display = "none";
            var numImagesFoundDiv = document.getElementById("numimagesfound")
            numImagesFoundDiv.origMessage = numImagesFoundDiv.origMessage || numImagesFoundDiv.innerHTML;
            numImagesFoundDiv.innerHTML = numImagesFoundDiv.origMessage.replace("%n", document.querySelectorAll(".imgContainer").length);
            document.getElementById("numimagesfound").style.display = "";
            // document.getElementById("selectalla").style.visibility="visible";
        } else {
            //console.log("results length: "+results.length);
            var processedImages = 0;
            var totalImages = 0;
            for (var r = 0; r < results.length; r++) {
                if (results[r] != null && results[r].images != null && results[r].images.length > 0) {
                    totalImages += results[r].images.length;
                }
            }
            if (totalImages == 0) {
                scanimg.foundlastimage();
                return;
            }

            $("#processedImages")[0].innerHTML = "analyzing 0 of " + totalImages + " images";

            for (var r = 0; r < results.length; r++) {
                if (results[r] == null || results[r].images == null)
                    continue
                localStorage.active_tab_origin = results[r].origin;
                var images = results[r].images;
                console.log("images length: " + images.length);
                if (results[r].isTop)
                    scanimg.title = results[r].title;
                for (var i = 0; i < images.length; i++) {
                    try {
                        console.log("going to inject img: " + images[i]);
                        if (scanimg.allimages[images[i]]) {
                            processedImages++;
                            continue;
                        }
                        scanimg.allimages[images[i]] = images[i];
                        var img = document.createElement("img");
                        img.src = images[i];
                        img.style.maxWidth = "600px";
                        function errorHandler() {
                            processedImages++;
                            $("#processedImages")[0].innerHTML = "processed " + processedImages + " of " + totalImages + " images";
                            if (processedImages == totalImages) {
                                scanimg.foundlastimage();
                            }
                        }
                        setTimeout(function (img) {
                            img.timeoutExpired = true;
                            errorHandler()
                        }, totalImages / 10 * 1000, img);
                        img.onerror = function () {
                            if (this.timeoutExpired)
                                return;
                            errorHandler()
                        }
                        img.onload = async function () {
                            if (this.timeoutExpired)
                                return;
                            processedImages++;
                            $("#processedImages")[0].innerHTML = "analyzing " + processedImages + " of " + totalImages + " images";

                            var imgSrc = this.src;
                            var div = document.createElement("div");
                            div.className = "imgContainer";

                            var width = this.width;    // Current image width
                            var height = this.height;  // Current image height
                            var pixels = width * height;
                            div.setAttribute("pixels", pixels);
                            div.setAttribute("width", width);
                            div.setAttribute("height", height);


                            var style = "style='wwidth:" + width + "px;hheight:" + height + "px'";
                            div.innerHTML = "<img class='origImg' id='" + imgSrc + "' src='" + imgSrc + "' " + style + "><div class='imgInfo'><div class='imgActions'><img class='zoomIcon' title='" + chrome.i18n.getMessage("Scan for deepfake") + "' src='" + chrome.extension.getURL("scan.png") + "' /></div><div class='imgSize imgDimension' style='margin-left:5px;'>-</div><div class='imgSize'>" + this.width + "x" + this.height + "</div><div class='imgSize imgType' style='margin-right:5px;'>other</div></div>";
                            div.setAttribute("imgsrc", imgSrc);

                            /*find the right place for appending based on pixels*/
                            var currentImagesDivs = document.getElementsByClassName("imgContainer");
                            var appended = false;
                            for (var i = 0; i < currentImagesDivs.length; i++) {
                                if (pixels > currentImagesDivs[i].getAttribute("pixels")) {
                                    $(currentImagesDivs[i]).before(div);
                                    appended = true;
                                    break;
                                }
                            }
                            if (!appended)
                                document.getElementById("imgsContainer").appendChild(div);

                            div.onclick = function (event) {
                                // if(event.target.className=="zoomIcon"){
                                //     //chrome.tabs.create({ url: imgSrc, active: !event.metaKey && !event.ctrlKey  });
                                //     chrome.tabs.create({ url: imgSrc, active: false});
                                //     return;
                                // }
                                scanimg.selectImg(this);
                            }
                            if (processedImages == totalImages)
                                scanimg.foundlastimage();
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    },
    selectImg: function (div, force, forceValue) {
        var src = div.getAttribute("imgsrc");
        // var checkbox = div.querySelector('input[type="checkbox"]');

        var toSelect = force ? forceValue : !scanimg.selection[src];
        // if(toSelect){
        //     checkbox.checked="checked";
        //     scanimg.selection[src]=src;
        //     div.classList.add("imgSelected");
        // }else{
        //     checkbox.checked="";
        //     delete scanimg.selection[src];
        //     div.classList.remove("imgSelected");
        // }
        var selectionLength = 0;
        for (var k in scanimg.selection) {
            if (scanimg.selection.hasOwnProperty(k))
                selectionLength++;
        }
        // if(selectionLength==0){
        //     // $("#downloadButton")[0].style.display="none";
        //     $("#foundimagesinnerdiv")[0].style.display="";
        // }else{
        //     $("#downloadButton")[0].innerHTML="<img src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDUyLjc1NiA1Mi43NTciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUyLjc1NiA1Mi43NTc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTI2LjEwNiwyOS4wNTlsMTAuNTIzLTEwLjUyM2MxLjA0Ny0xLjAyNCwwLjgxMy0xLjc0Ni0wLjY0OS0xLjc0NmgtNS44NzNMMzAuMTA4LDRjMC0yLjIwOS0xLjc5LTQtNC00bDAsMCAgICAgYy0yLjIwOSwwLTQsMS43OTEtNCw0bC0wLjAwMSwxMi43ODloLTUuODc2Yy0xLjQ2Mi0wLjAwMS0xLjY5MywwLjcyMy0wLjY0NiwxLjc0N0wyNi4xMDYsMjkuMDU5eiIgZmlsbD0iI0ZGRkZGRiIvPgoJCQk8cGF0aCBkPSJNNDkuMDI3LDI1Ljc3aC02LjA0OWMtMC41NTQsMC0xLDAuNDQ3LTEsMXYxNy45MzlIMTAuNzhWMjYuNzdjMC0wLjU1My0wLjQ0Ny0xLTEtMUgzLjczMWMtMC41NTMsMC0xLDAuNDQ3LTEsMXYyMC40NjQgICAgIGMwLDMuMDQ1LDIuNDc5LDUuNTIyLDUuNTI0LDUuNTIyaDM2LjI0OGMzLjA0NiwwLDUuNTIzLTIuNDc5LDUuNTIzLTUuNTIyVjI2Ljc3QzUwLjAyNywyNi4yMTcsNDkuNTgxLDI1Ljc3LDQ5LjAyNywyNS43N3oiIGZpbGw9IiNGRkZGRkYiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==' />"+chrome.i18n.getMessage("manyfilesnum").replace("%n",selectionLength);
        //     $("#downloadButton")[0].style.display="";
        //     $("#foundimagesinnerdiv")[0].style.display="none";
        // }
        var allimages = document.getElementsByClassName("imgContainer");
    },

    init: function () {

        scanimg.localize();
        scanimg.getImages();

        // if (chrome.downloads.onDeterminingFilename)
        //     chrome.downloads.onDeterminingFilename.addListener(scanimg.suggestFileName);
        $(".filters > div").on("mousedown", function (event) {
            $(this).find(".selectMenu").show()
        });
        $(document.body).on("click", function (event) {
            $(".filters div").each(function () {
                var menuEl = this;
                var clickedOnMenu = menuEl == event.target;

                $(event.target).parents().each(function () {
                    if (this == menuEl)
                        clickedOnMenu = true;
                });
                if (clickedOnMenu)
                    return;
                $(menuEl).find(".selectMenu").hide();
            })
        });
        $(".typeMenu").on("click", function (event) {
            var typeMenu = this;
            conf.imgtype = $(event.target).attr("typeConf");
            if (conf.imgtype.indexOf("any") == 0)
                conf.imgtype = null;

            $(typeMenu).find("div[typeConf]").each(function () {
                $(this).removeClass("selected");
            });



            var menuLabel = $(event.target).closest(".filters > div").find(".menuLabel");
            menuLabel.removeClass("changedMenu")
            menuLabel.html("Type")
            if (conf.imgtype) {
                menuLabel.addClass("changedMenu")
                menuLabel.html(conf.imgtype)
            }
            $(event.target).addClass("selected")
            scanimg.foundlastimage();
            $(typeMenu).hide();
        });
    },
    getConf: function (callback) {
        chrome.storage.sync.get({
            minwidth: conf.defaults.minwidth,
            minheight: conf.defaults.minheight,
            // downloadseparatefolder:conf.defaults.downloadseparatefolder,
            // downloadfolderpref:conf.defaults.downloadfolderpref,
            savefoldername: conf.defaults.savefoldername,
            donotbother: conf.defaults.donotbother,
            numviews: conf.defaults.numviews,
            allframes: conf.defaults.allframes,
            biggerview: conf.defaults.biggerview,
            twocols: conf.defaults.twocols,
            newshown1: conf.defaults.newshown1,
            hidetools: conf.defaults.hidetools,
            savesize: conf.defaults.savesize,
            sizetype: conf.defaults.sizetype
        },
            function (items) {
                // conf.downloadseparatefolder=items.downloadseparatefolder;
                // conf.downloadfolderpref=items.downloadfolderpref;
                conf.savefoldername = items.savefoldername;
                conf.donotbother = items.donotbother;
                conf.biggerview = items.biggerview;
                conf.twocols = items.twocols;
                conf.allframes = items.allframes;
                conf.newshown1 = items.newshown1;
                conf.hidetools = items.hidetools;
                conf.savesize = items.savesize;
                conf.sizetype = items.sizetype;
                conf.minwidth = items.minwidth;
                conf.minheight = items.minheight;
                callback();

                scanimg.numviews = items.numviews + 1;
                var howoftentoshowrating = scanimg.numviews > 1000 ? 100000 : scanimg.numviews > 100 ? 1000 : scanimg.numviews > 10 ? 100 : 10;
                // if(scanimg.numviews%howoftentoshowrating==0){
                //     scanimg.showRating();
                // }
                chrome.storage.sync.set({
                    numviews: scanimg.numviews
                });
            }
        );
    },
    foundlastimage: function () {
        chrome.runtime.getBackgroundPage(function (bgWindow) {
            if (conf.savesize)
                scanimg.saveSizeConf();
            $(".imgContainer").each(function () {
                var div = $(this);
                scanimg.selectImg(this, true, false);//reset old selection
                div[0].className = "imgContainer";
                var imgSrc = div.attr("imgsrc");
                var imgWidth = parseInt(div.attr("width"));
                var imgHeight = parseInt(div.attr("height"));
                var imgPixels = parseInt(div.attr("pixels"));
                var sizeType = div.attr("sizeType");
                var layout = div.attr("layout");

                var mimeType;
                var imgType;
                var dimension;
                try {
                    var reqDetails = bgWindow.imagesCT[imgSrc];
                    if (reqDetails) {
                        mimeType = reqDetails.mimeType;
                        dimension = reqDetails.contentLength;
                    }
                    if (!mimeType) {
                        if (imgSrc.indexOf("data:image/") == 0) {
                            mimeType = imgSrc.substring(5, imgSrc.indexOf(";"));
                        } else {
                            var imgSrcNoParams = imgSrc.split("?")[0].toLowerCase();
                            mimeType = imgSrcNoParams.substring(imgSrcNoParams.lastIndexOf(".") + 1, imgSrcNoParams.length).toLowerCase();
                        }
                    }
                    mimeType = mimeType ? mimeType.toLowerCase() : "";
                    imgType = mimeType.indexOf("jpg") != -1 ? "JPG" :
                        mimeType.indexOf("jpeg") != -1 ? "JPG" :
                            mimeType.indexOf("png") != -1 ? "PNG" :

                                "-";
                } catch (e) { }
                imgType = imgType || "-";
                var imgTypeDiv = div.find(".imgType");
                imgTypeDiv.html(imgType);
                div.attr("type", imgType);

                if (conf.imgtype && imgType != conf.imgtype) {
                    div.addClass("excluded excludedType");
                }
            })

            scanimg.selection = new Object();//reset old selection

            var typeSelector = ".imgContainer:not(.excludedUrl):not(.excludedSize):not(.excludedLayout)";

            scanimg.stats = {

                types: {
                    "JPG": $(typeSelector + "[type='JPG']").length,
                    "PNG": $(typeSelector + "[type='PNG']").length
                }
            }

            $(".typeMenu").find("div[typeConf]").each(function () {
                var currType = $(this).attr("typeConf");
                console.log(currType);
                var currTypeNum = scanimg.stats.types[currType];
                currTypeNum = currTypeNum || 0;
                $(this).html(currType.charAt(0).toUpperCase() + currType.slice(1) + " (" + currTypeNum + ")");
                this.style.setProperty('color', currTypeNum ? "inherit" : "lightGray", currTypeNum ? "" : "important");

            });

            document.getElementById("spinner").style.display = "none";
            document.querySelectorAll(".imgContainer").forEach(function (el) {
                el.style.display = "-webkit-box";
            })
            var numImagesFoundDiv = document.getElementById("numimagesfound")
            numImagesFoundDiv.origMessage = numImagesFoundDiv.origMessage || numImagesFoundDiv.innerHTML;
            numImagesFoundDiv.innerHTML = numImagesFoundDiv.origMessage.replace("%n", document.querySelectorAll(".imgContainer:not(.excluded)").length);
            document.getElementById("searchingimages").style.display = "none";
            document.getElementById("numimagesfound").style.display = "";
        })
    },
    localize: function () {
        var spans = document.querySelectorAll(".localizedSpan");
        for (var i = 0; i < spans.length; i++) {
            var message = chrome.i18n.getMessage(spans[i].getAttribute("messagesKey"));
            if (message)
                spans[i].innerHTML = message
        }
    }
}
scanimg.getConf(scanimg.init);