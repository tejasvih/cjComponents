/**
 * Desktop
 * Calibre Technologies
 */
//init desktop

(function($, Ventus) {
	document.addEventListener('DOMContentLoaded', function() {

        var wm = new Ventus.WindowManager();
        //var __wm = wm;

        var pos = 50;
        var num = 1;
        window.wm = wm; // For debugging reasons

        $('.create-button').click(function () {
            wm.createWindow({
                title: 'Window ' + (num++),
                x: (pos += 60),
                y: pos,
                width: 400,
                height: 250,

                events: {
                    closed: function () {
                        this.destroy();
                    }
                }
            })
                .open();
        });

        $('.expose-button').click(_.throttle(function () {
            if (wm.mode === 'expose')
                wm.mode = 'default';
            else
                wm.mode = 'expose';

            return false;
        }, 1000));
 /*
        var aboutWin = wm.createWindow.fromQuery('.about-app', {
            title: 'About',
            width: 250,
            height: 280,
            x: 140,
            y: 380,

            events: {
                closed: function () {
                    this.destroy();
                }
            }
        });
        aboutWin.open();
       
        var elem = document.getElementById('iframeWin');
        wm.createWindow.fromElement(elem, {
            title: 'My App',
            width: 500,
            height: 500,
            x: 300,
            y: 400,

            events: {
                closed: function () {
                    this.destroy();
                }
            }
        }).open();*/
        //end listener
	});
})($, Ventus);

window.vmwindows = [];
window.lastWindowPos = 50;

function createIframe(url) {

    var iframeDiv = document.createElement('div');
    //iframeDiv.className += " iframe-win";

    iframeDiv.style.margin = "0";
    iframeDiv.style.height = "100%";
    iframeDiv.style.overflow = "hidden";

    var iframe = document.createElement('iframe');
    iframe.setAttribute('width', "100%");
    iframe.setAttribute('height', "100%");
    iframe.setAttribute('frameborder', "0");
    if (url) {
        iframe.src = url;
    }

    iframeDiv.appendChild(iframe);
    document.body.appendChild(iframeDiv);
    return iframeDiv;
}

function openUrlWindow(title, url) {
    var elem = createIframe(url);//document.getElementById("iframeWin");
    openElemWindow(title, elem, {});
}
function openElemWindow(title, elem,options) {
    /*if (!((window.vmwindows[elName] == undefined) || (window.vmwindows[elName] == null))) {
        var win = window.vmwindows[elName];
        return win;
    }*/
    options = options || {};
    var w = options.w;
    var h = options.h;
    var t = options.t;
    var l = options.l;

    w = (w == undefined) ? 800 : w;
    h = (h == undefined) ? 600 : h;
    l = (l == undefined) ? /*(window.innerWidth - w) / 2*/ (window.lastWindowPos += 60) : l;
    t = (t == undefined) ? /*(window.innerHeight - h) / 2*/ window.lastWindowPos : t;
    

    t = parseInt(t);
    l = parseInt(l);

    if (t < 0)
        t = 0;

    if (l < 0)
        l = 0;
    
    screen.width;
    //var elem = document.getElementById(elName);
    var wn = window.wm.createWindow.fromElement(elem, {
        title: title,
        width: w,
        height: h,
        x: l,
        y: t,

        events: {
            closed: function () {
                this.destroy();
            }
        }
    });
    wn.__elem = elem;
    /*if (options.url) {
        elem.src = url;
    }*/
    wn.open();
    return wn;
}
function openWindowBySelector(title, selector, w, h, t, l) {
    if (!((window.vmwindows[selector] == undefined) || (window.vmwindows[selector] == null))) {
        var win = window.vmwindows[selector];
        return win;
    }
    w = (w == undefined) ? 800 : w;
    h = (h == undefined) ? 600 : h;
    l = (l == undefined) ? /*(window.innerWidth - w) / 2*/ (window.lastWindowPos += 60) : l;
    t = (t == undefined) ? /*(window.innerHeight - h) / 2*/ window.lastWindowPos : t;

    t = parseInt(t);
    l = parseInt(l);

    if (t < 0)
        t = 0;

    if (l < 0)
        l = 0;

    screen.width;
    
    var w = window.wm.createWindow.fromQuery(selector, {
        title: title,
        width: w,
        height: h,
        x: l,
        y: t,

        events: {
            closed: function () {
                this.destroy();
            }
        }
    });
    w.open();
    return w;
}
//Utility functions
function showAlertOverlay() {
    $('.alert-overlay').show();
}
function hideAlertOverlay() {
    $('.alert-overlay').hide();
}