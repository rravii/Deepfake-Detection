// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
const referrerHeaderName = 'Referer';

var imagesCT={};
var redirectRequests={};
var cleanUpInterval=1000*60*60*24;
setInterval(function(){
    for (var k in imagesCT) 
        if (imagesCT.hasOwnProperty(k))
            if(((new Date().getTime())-imagesCT[k].creationTS)>cleanUpInterval){
                delete imagesCT[k]
                delete redirectRequests[k]
            }
},cleanUpInterval)

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        var views = chrome.extension.getViews({
            type: "popup"
        });
        if (views[0] && views[0].imageye && details.initiator === window.location.origin) {
            const activeTabOrigin = localStorage.active_tab_origin;
            const referrerHeader = details.requestHeaders.find(
                (header) => header.name === referrerHeaderName
            );
            if (referrerHeader) {
                referrerHeader.value = activeTabOrigin;
            } else {
                details.requestHeaders.push({
                    name: referrerHeaderName,
                    value: activeTabOrigin,
                });
            }
        }
        return {
            requestHeaders: details.requestHeaders,
        };
    }, {
        urls: ['<all_urls>']
    },
    ['blocking', 'requestHeaders', 'extraHeaders']
);
chrome.webRequest.onBeforeRedirect.addListener(function(details) {
    var views = chrome.extension.getViews({
        type: "popup"
    });
    if (views[0] && views[0].imageye && details.tabId==-1) {
        redirectRequests[details.redirectUrl]=details.url;
    }
}, {
    urls: ['<all_urls>']
}, ['responseHeaders']);

chrome.webRequest.onCompleted.addListener(function(details) {
    var views = chrome.extension.getViews({
        type: "popup"
    });
    if (views[0] && views[0].imageye && details.tabId==-1) {
        var imgUrl=redirectRequests[details.url] || details.url
        imagesCT[imgUrl]={
            mimeType:getHeaderFromHeaders(details.responseHeaders, 'content-type'),
            contentLength:getHeaderFromHeaders(details.responseHeaders, 'content-length'),
            creationTS:new Date().getTime()
        };
    }
}, {
    urls: ['<all_urls>']
}, ['responseHeaders']);
function getHeaderFromHeaders(headers, headerName) {
    for (var i = 0; i < headers.length; ++i) {
        var header = headers[i];
        if (header.name.toLowerCase() === headerName) {
            return header.value;
        }
    }
}