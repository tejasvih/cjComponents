/*
Data Model 1.0
Calibre Technologies 2018
*/


function triggerEvent(el, type) {
    if ((el[type] || false) && typeof el[type] == 'function') {
        el[type](el);
    }
}
function setValueToElement(element, value) {
    var type = element.type;
    if (type == "checkbox" || type == "radio") {
        element.checked = element.value == value;
    }
    else if (type == "hidden" || type == "password" || type == "text" || type == "textarea") {
        element.value = value;
    }
    else if (type == "select-one" || type == "select-multiple") {
        element.value = value;
        //todo handle aray type value for multi select
        for (var j = 0; j < element.options.length; j++) {
            if (element.options[j].value == value) {
                element.options[j].selected = true;
            }
        }
        triggerEvent(element, 'onchange');

    }
    else {
        element.innerHTML = value;
    }
}
function ApplyModel(model,modelName,index) {
    //var bodyElements = document.body.getElementsByTagName("*");

    Object.keys(model).forEach(
        function (key) {
            var value = model[key];
            if (value === null || value === undefined)
                return;

            var elements = document.getElementsByName(key);
            if (elements !== undefined) {
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    var attrkey = element.getAttribute('data-var');
                    var attrModel = element.getAttribute('data-model');
                    var attrIndex = element.getAttribute('data-var-index');
                    if (attrModel === null || attrModel === undefined || attrModel === modelName) {
                        if (attrkey === null || attrkey === key) {
                            if (((index === undefined) && (attrIndex === null || attrIndex === '')) || (attrIndex === index))
                                setValueToElement(element, value);
                        }
                    }
                }
            }
            elements = document.querySelectorAll("[data-var='"+key+"']");
            if (elements !== undefined) {
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    var attrIndex = element.getAttribute('data-var-index');
                    var attrModel = element.getAttribute('data-model');
                    if (attrModel === null || attrModel === undefined || attrModel === modelName) {
                        if (((index === undefined) && (attrIndex === null || attrIndex === '')) || (attrIndex == index))
                            setValueToElement(element, value);
                    }


                }
            }
        }
    );
}