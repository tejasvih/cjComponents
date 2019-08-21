/*
 * cUtils
 * Calibre Technologies
 * Tejasvi Hegde
 * */
"use strict";

class cUtils {
    static isFunction(v) {
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
    static IsObject(obj) {
        return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
    }
    static IsArray(obj) {
        return Array.isArray(obj);
    }
    static IsString(obj) {
        return (typeof obj === 'string');
    }
    static IsBoolean(obj) {
        return (typeof obj === 'boolean');
    }
    static IsNumber(obj) {
        return (typeof obj === 'number');
    }
    static EndsWith(text, word) {
        var diff = text.length - word.length;
        if (diff < 0)
            return false;
        return (text.lastIndexOf(word) === diff);
    }


    static GetElement(tag: string, cls: string = null, style: string = null, attribs: any = null, content: any = null) {
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
            let children = cUtils.GetElementFromHTML(content);
            if (children != null)
                while (children.length > 0) {
                    element.appendChild(children[0]);
                }
        }


        return element;
    }
    static GetElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.childNodes;
    }

    static appendTo(parentElem,childElem) {
        if (parentElem == null) return;
        let _parent = parentElem;
        if (typeof parentElem === 'string') {
            _parent = document.getElementById(parentElem);
        }
        _parent.appendChild(childElem);
    }
    static writeTo(parentElem, childElem) {
        if (parentElem == null) return;
        let _parent = parentElem;

        if (typeof parentElem === 'string') {
            _parent = document.getElementById(parentElem);
        }
        while (_parent.firstChild) {
            _parent.removeChild(_parent.firstChild);
        }
        cUtils.appendTo(_parent, childElem);
    }

    static addClass(elem,className) {
        elem.classList.add(className);
        return this;
    }
    static containsClass(elem,className) {
        return elem.classList.contains(className);
    }
    static removeClass(elem,className) {
        elem.classList.remove(className);
        return this;
    }
    static setAttribute(elem,name, value) {
        elem.setAttribute(name, value);
        return this;
    }
    static removeAttribute(elem,name) {
        elem.removeAttribute(name);
        return this;
    }
    static hasAttribute(elem,name) {
        return elem.hasAttribute(name);
    }
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

