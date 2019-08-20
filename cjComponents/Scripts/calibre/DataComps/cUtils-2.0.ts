/*
 * cUtils
 * Calibre Technologies
 * Tejasvi Hegde
 * */
"use strict";

function isFunction(v) {
    //If our variable is an instance of "Function"
    if (v instanceof Function) {
        return true;
    }
    return false;
    /*
     if (typeof data === "function") {
        // do something
    }
     * */
}
function IsObject(obj) {
    return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]'
}
function IsArray(obj) {
    return Array.isArray(obj)
}
function IsString(obj) {
    return (typeof obj === 'string')
}
function IsBoolean(obj) {
    return (typeof obj === 'boolean')
}
function IsNumber(obj) {
    return (typeof obj === 'number')
}

function EndsWith(text, word) {
    var diff = text.length - word.length;
    if (diff < 0)
        return false;
    return (text.lastIndexOf(word) === diff);
}

function GetElement(tag: string, cls: string = null, style: string = null, attribs: any = null,content : any = null) {
    let element = document.createElement(tag);
    if (cls) {
        element.className += " " + cls;
    }
    if (style) {
        element.setAttribute("style", style);
    }
    if (attribs) {
        Object.getOwnPropertyNames(attribs).forEach(
            function (val, idx, array) {
                element.setAttribute(val, attribs[val]);
            }, this);
    }
    if (content != null) {
        let children = GetElementFromHTML(content);
        if (children != null)
            while (children.length > 0) {
                element.appendChild(children[0]);
            }
    }
    

    return element;
}
function GetElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.childNodes;
}
/**
 * Created to get bootstrap width from unit
 * @param width object or number. If object { md : 1, xs : 1 etc..}
 */

function GetSizeClass(width : any,defWidth : number = 1) {
    if (width == null)
        width = defWidth;
    if (typeof width === 'number') {
        return 'col-' + width;
    }
    let str: string = '';
    if (typeof width === 'object') {
        Object.getOwnPropertyNames(width).forEach(
            function (val, idx, array) {
                str += ' col-' + val + '-' + width[val];
            }, this);
    }
    return '';
}

class cAjax {

    XMLhttp: XMLHttpRequest;
    Config: any;
    constructor(config: any) {
        /*Config Structure
            url:"reqesting URL"
            
            contentType :   application/x-www-form-urlencoded' / 'application/json' default
            type: (OPTIONAL) GET or POST, default POST
            isAsync: (OPTIONAL) True for async and False for Non-async | By default its Async
            beforeSend : (XMLhttp, sendData) returning false will terminate request, true will proceed, any changes in data can be done and returned
            success: (OPTIONAL) Success callback, function(XMLhttp,data,status)
            errorCallback : (OPTIONAL) Error Callback
    */
        this.XMLhttp = new XMLHttpRequest();

        if (!config.url) {
            return;
        }

        if (!config.type) {
            config.type = 'POST';
        }
        if (!config.contentType) {
            config.contentType = 'application/json';
        }
        
        if (!config.isAsync) {
            config.isAsync = true;
        }
        this.Config = config;

        this.XMLhttp.onreadystatechange = this.readyStateChange; 

        
    }
    Call(data : any = null, dataParams : any = null) {

        /*
         data:  another Nested Object which should contains reqested Properties in form of Object Properties, or can be function
         dataParams :  (OPTIONAL) parameters to be passed if data is function
         * */
        let sendString: string, sendData = isFunction(data) ? data(dataParams) : data;
        /*
         * let vals: any[] = []
         * 
         * https://github.com/flouthoc/minAjax.js/blob/master/index.js
        if (typeof sendData === "string") {
            var tmpArr = String.prototype.split.call(sendData, '&');
            for (var i = 0, j = tmpArr.length; i < j; i++) {
                var datum = tmpArr[i].split('=');
                vals.push(encodeURIComponent(datum[0]) + "=" + encodeURIComponent(datum[1]));
            }
        } else if (typeof sendData === 'object' && !(sendData instanceof String || (FormData && sendData instanceof FormData))) {
            for (var k in sendData) {
                var datum = sendData[k];
                if (Object.prototype.toString.call(datum) == "[object Array]") {
                    for (var i = 0, j = datum.length; i < j; i++) {
                        vals.push(encodeURIComponent(k) + "[]=" + encodeURIComponent(datum[i]));
                    }
                } else {
                    vals.push(encodeURIComponent(k) + "=" + encodeURIComponent(datum));
                }
            }
        }
        sendString = sendString.join('&');
        */

        if (this.Config.beforeSend) {
            var result = this.Config.beforeSend(this.XMLhttp, sendData);
            if (result === false)
                return;
            if (result === true) { }
            else
                sendData = result;
        }
        if (typeof sendData === "string") {
            sendString = sendData;
        } else if (typeof sendData === 'object' && !(sendData instanceof String || (FormData && sendData instanceof FormData))) {
            sendString = JSON.stringify(sendData);
        }


        if (this.Config.type == "GET") {
            this.XMLhttp.open("GET", this.Config.url + "?" + encodeURI(sendString), this.Config.isAsync);
            this.XMLhttp.send();
        }
        if (this.Config.type == "POST" || this.Config.type == "PUT") {
            this.XMLhttp.open("POST", this.Config.url, this.Config.isAsync);
            this.XMLhttp.setRequestHeader("Content-type", this.Config.contentType);
            this.XMLhttp.send(sendString);
        }
    }
    private readyStateChange() {
        if (this.XMLhttp.readyState == 4 && this.XMLhttp.status == 200) {
            if (this.Config.success) {
                if (this.Config.contentType = 'application/json') {
                    this.Config.success(this.XMLhttp, JSON.parse(this.XMLhttp.responseText));
                }
                else {
                    this.Config.success(this.XMLhttp, this.XMLhttp.responseText);
                }
            }
        } else {

            if (this.Config.errorCallback) {
                this.Config.errorCallback(this.XMLhttp);
            }
        }
    }
}