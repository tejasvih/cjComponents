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

function EndsWith(text, word) {
    var diff = text.length - word.length;
    if (diff < 0)
        return false;
    return (text.lastIndexOf(word) === diff);
}