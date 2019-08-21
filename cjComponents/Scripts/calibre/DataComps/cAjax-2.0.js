/*
 * cUtils
 * Calibre Technologies
 * Tejasvi Hegde
 * */
"use strict";
class cAjax {
    constructor(config) {
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
    Call(data = null, dataParams = null) {
        /*
         data:  another Nested Object which should contains reqested Properties in form of Object Properties, or can be function
         dataParams :  (OPTIONAL) parameters to be passed if data is function
         * */
        let sendString, sendData = cUtils.isFunction(data) ? data(dataParams) : data;
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
        }
        else if (typeof sendData === 'object' && !(sendData instanceof String || (FormData && sendData instanceof FormData))) {
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
    readyStateChange() {
        if (this.XMLhttp.readyState == 4 && this.XMLhttp.status == 200) {
            if (this.Config.success) {
                if (this.Config.contentType = 'application/json') {
                    this.Config.success(this.XMLhttp, JSON.parse(this.XMLhttp.responseText));
                }
                else {
                    this.Config.success(this.XMLhttp, this.XMLhttp.responseText);
                }
            }
        }
        else {
            if (this.Config.errorCallback) {
                this.Config.errorCallback(this.XMLhttp);
            }
        }
    }
}
//# sourceMappingURL=cAjax-2.0.js.map