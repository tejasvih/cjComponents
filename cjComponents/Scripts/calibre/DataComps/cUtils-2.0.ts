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
        //return (item && typeof item === 'object' && !Array.isArray(item));
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

    static copyIfNoExists(src,dest) {
        Object.keys(src).forEach((key) => {
            if (dest[key] == null) {
                dest[key] = src[key]
            }
        }, this);
    }
    static copyEvenIfNoExists(src, dest) {
        Object.keys(src).forEach((key) => {
                dest[key] = src[key]
        }, this);
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
            let children = cUtils.GetElementsFromHTML(content);
            if (children != null)
                for (var i = 0; i < children.length;i++) {
                    element.appendChild(children[i]);
                }
        }


        return element;
    }
    static GetElementsFromHTML(htmlString) {

        let template = document.createElement('template');
        template.innerHTML = htmlString;
        return template.content.childNodes;

        /*let div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.childNodes;*/
    }

    static appendTo(parentElem,childElem) {
        if (parentElem == null) return;
        let _parent = parentElem;
        if (typeof parentElem === 'string') {
            _parent = document.getElementById(parentElem);
        }
        if (cUtils.IsArray(childElem)/* || (childElem instanceof NodeList)*/) {
            for (var i = 0; i < childElem.length; i++) {
                _parent.appendChild(childElem[i]);
            }
        }
        else if ((childElem instanceof NodeList)) {
            while(childElem.length > 0) {
                _parent.appendChild(childElem[0]);
            }
        }
        else {
            _parent.appendChild(childElem);
        }

        
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

    static addClass(elem, className) {
        
        if (className) {
            if (className.trim().length > 0) {
                let classes = className.split(' ');
                elem.classList.add(...classes);
            }
        }
            
        return this;
    }
    static containsClass(elem,className) {
        return elem.classList.contains(className);
    }
    static removeClass(elem, className) {
        if (className)
            elem.classList.remove(className);
        return this;
    }
    static setAttribute(elem, name, value) {
        if (name)
            elem.setAttribute(name, value);
        return this;
    }
    static removeAttribute(elem, name) {
        if (name)
            elem.removeAttribute(name);
        return this;
    }
    static hasAttribute(elem,name) {
        return elem.hasAttribute(name);
    }

    static WordToSentence(text) {
        var pos = text.lastIndexOf('Id');
        if (pos == text.length - 2)
            text = text.substring(0, pos);
        var result = text.replace(/([A-Z])/g, " $1");//([a-z])([A-Z])
        return result.charAt(0).toUpperCase() + result.slice(1);
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

