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