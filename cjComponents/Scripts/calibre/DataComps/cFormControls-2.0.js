/*
 * cFormControls
 * Calibre Technologies
 * Tejasvi Hegde
 * In Plain Vanilla JS, Does not require any other dependant library i.e. jQuery
 * Status: Can run Beta test
 *
 * TODO: attach data to control using data : { name: value ... }
 * LabelFor control
 * icon prefix/suffix
 *
 *
 * */
"use strict";
class ControlBuilder {
    textBox(controlDef) {
        return new cTextControl(controlDef);
    }
    password(controlDef) {
        return new cPasswordControl(controlDef);
    }
    hidden(controlDef) {
        return new cHiddenControl(controlDef);
    }
    checkBox(controlDef) {
        return new cCheckBoxControl(controlDef);
    }
    radio(controlDef) {
        return new cRadioControl(controlDef);
    }
    select(controlDef) {
        return new cSelectControl(controlDef);
    }
    textArea(controlDef) {
        return new cTextAreaControl(controlDef);
    }
    htmlControl(controlDef) {
        return new cHtmlControl(controlDef);
    }
    staticControl(controlDef) {
        return new cStaticControl(controlDef);
    }
}
class cBaseControl {
    constructor(controlTag, controlDef) {
        this.__ClassName = 'cBaseControl';
        this.ControlDef = {};
        this.IsInlineClosure = true;
        this.PropertyMap = {};
        this.ValidationPropertyMap = { message: 'data-msg' };
        this.Properties = {};
        this.PropertiesToIgnore = ['dataType'];
        this.PropertyGroupHandlers = { 'validation': this.PrepareValidationProperties };
        this.ControlTag = controlTag;
        if ((controlDef != null) && (controlDef != undefined))
            this.ControlDef = controlDef;
        if (!(this instanceof cHtmlControl)) {
            this.Element = document.createElement(this.ControlTag);
            this.PrepareProperties(null, this.ControlDef);
            this.Build();
        }
        else {
            this.Element = cUtils.GetElementsFromHTML(this.ControlDef.html);
        }
    }
    getPropertiesToIgnore() {
        return this.PropertiesToIgnore;
    }
    static isBaseControl(obj) {
        return obj instanceof cBaseControl;
    }
    Build(value = null, index = null, attribs = null, prefix = null, suffix = null) {
        this.BuildHtmlObject(value, index, attribs, prefix, suffix);
        return this;
    }
    get Html() {
        var wrap = document.createElement('div');
        wrap.appendChild(this.Element.cloneNode(true));
        return wrap.innerHTML;
    }
    get Value() {
        return this.Element.value;
    }
    set Value(value) {
        this.Element.setAttribute('value', value);
    }
    appendTo(parentElem) {
        cUtils.appendTo(parentElem, this.Element);
        return this;
    }
    writeTo(parentElem) {
        cUtils.writeTo(parentElem, this.Element);
        return this;
    }
    GetElementContent(value, index, attribs, prefix, suffix) {
        return null;
    }
    PrepareAdditionalProperties() {
    }
    addClass(className) {
        cUtils.addClass(this.Element, className);
        return this;
    }
    containsClass(className) {
        return cUtils.containsClass(this.Element, className);
    }
    removeClass(className) {
        cUtils.removeClass(this.Element, className);
        return this;
    }
    setAttribute(name, value) {
        cUtils.setAttribute(this.Element, name, value);
        return this;
    }
    removeAttribute(name) {
        cUtils.removeAttribute(this.Element, name);
        return this;
    }
    hasAttribute(name) {
        return cUtils.hasAttribute(this.Element, name);
    }
    BuildHtmlObject(value = null, index = null, attribs = null, prefix = null, suffix = null) {
        Object.getOwnPropertyNames(this.Properties).forEach(function (val, idx, array) {
            //prepare names and ids based on supplied params
            let attribVal = this.Properties[val]; //(typeof this.Properties[val] === 'string' ? this.Properties[val].replace("\"", "'") : this.Properties[val]);
            switch (val.toLowerCase()) {
                case 'name':
                    {
                        if (index != null) {
                            if (prefix != null) {
                                attribVal = prefix + '[' + index + '].' + attribVal;
                            }
                            else
                                attribVal = attribVal + '[' + index + ']';
                        }
                        if (prefix != null) {
                            if (index == null)
                                attribVal = prefix + '.' + attribVal;
                        }
                        if (suffix != null) {
                            attribVal = attribVal + '.' + suffix;
                        }
                    }
                    break;
                case 'id':
                    {
                        if (index != null) {
                            if (prefix != null) {
                                attribVal = prefix + '_' + index + '__' + attribVal;
                            }
                            else
                                attribVal = attribVal + '_' + index;
                        }
                        if (prefix != null) {
                            if (index == null)
                                attribVal = prefix + '_' + attribVal;
                        }
                        if (suffix != null) {
                            attribVal = attribVal + '_' + suffix;
                        }
                    }
                    break;
                case 'value':
                    {
                        if (value != null) {
                            attribVal = value;
                        }
                    }
                    break;
            }
            if (attribVal != null)
                this.setAttribute(val, attribVal);
        }, this);
        //Additional attribs
        if (attribs != null) {
            Object.getOwnPropertyNames(attribs).forEach(function (val, idx, array) {
                //prepare names and ids based on supplied params
                let attribVal = (typeof attribs[val] === 'string' ? attribs[val].replace("\"", "'") : attribs[val]);
                this.setAttribute(val, attribVal);
            }, this);
        }
        this.onSetValue(value);
        var elemContent = this.GetElementContent(value, index, attribs, prefix, suffix);
        if (elemContent != null) {
            this.Element.innerHTML = elemContent;
        }
        return this.Element;
    }
    onSetValue(value) {
        if (value != null) {
            this.setAttribute('value', value);
        }
    }
    PrepareProperties(propGroupName, props) {
        let propsToIgnore = this.getPropertiesToIgnore();
        if (propsToIgnore != null) {
            this.PropertiesToIgnore = [...this.PropertiesToIgnore, ...propsToIgnore];
        }
        /*Prepare Properties*/
        Object.getOwnPropertyNames(props).forEach(function (_key, idx, array) {
            if (this.PropertiesToIgnore.indexOf(_key) >= 0)
                return;
            let _propVal = this.ControlDef[_key];
            if ((typeof _propVal === 'string') || (typeof _propVal === 'boolean') || (typeof _propVal === 'number')) {
                let name = this.PropertyMap[_key] || _key;
                this.Properties[(name ? name : _key)] = _propVal;
            }
            else if (cUtils.IsObject(_propVal)) {
                //its object... collect values recursively
                if (this.PropertyGroupHandlers[_key]) {
                    this.PropertyGroupHandlers[_key](this, _propVal);
                }
            }
        }, this);
        if (!this.hasAttribute('id') && this.Properties['name'])
            this.setAttribute('id', this.Properties['name']);
        if (this.Properties['readonly'] !== undefined && this.Properties['readonly'] === false) {
            this.removeAttribute('readonly');
        }
        if (this.Properties['disabled'] !== undefined && this.Properties['disabled'] === false) {
            this.removeAttribute('disabled');
        }
        this.PrepareAdditionalProperties();
    }
    PrepareValidationProperties(obj, props) {
        //use obj instead of this
        obj.setAttribute('required', 'required');
        Object.getOwnPropertyNames(props).forEach(function (_key, idx, array) {
            if (obj.PropertiesToIgnore.indexOf('validation.' + _key) >= 0)
                return;
            let name = obj.ValidationPropertyMap[_key];
            obj.setAttribute((name ? name : _key), props[_key]);
        }, obj);
        if (props.maxlength !== undefined) {
            obj.setAttribute('data-msg-maxlength', 'Maximum allowed is ' + props.maxlength + ' characters/digits');
            obj.setAttribute('data-rule-maxlength', props.maxlength);
        }
        if (props.minlength !== undefined) {
            obj.setAttribute('data-msg-minlength', 'Minimum required is ' + props.minlength + ' characters/digits');
            obj.setAttribute('data-rule-minlength', props.minlength);
        }
    }
}
class cHiddenControl extends cBaseControl {
    constructor(controlDef) {
        super('input', controlDef);
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'hidden';
    }
}
class cHtmlControl extends cBaseControl {
    constructor(controlDef) {
        super('', controlDef);
    }
}
class cStaticControl extends cBaseControl {
    constructor(controlDef) {
        super('span', controlDef);
    }
    getPropertiesToIgnore() {
        return ['text', 'content', 'value'];
    }
    GetElementContent(value, index, attribs, prefix, suffix) {
        return this.ControlDef.text || this.ControlDef.content || this.ControlDef.value;
    }
    onSetValue(value) {
        //do nothing, just ignore
    }
}
class cCheckBoxControl extends cBaseControl {
    constructor(controlDef) {
        super('input', controlDef);
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'checkbox';
    }
}
class cRadioControl extends cBaseControl {
    constructor(controlDef) {
        super('input', controlDef);
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'radio';
    }
}
class cTextAreaControl extends cBaseControl {
    constructor(controlDef) {
        super('textarea', controlDef);
    }
    PrepareAdditionalProperties() {
    }
}
class cSelectControl extends cBaseControl {
    constructor(controlDef) {
        super('select', controlDef);
    }
    getPropertiesToIgnore() {
        return ['url', 'EmptyOption', 'OptionsHtml', 'value'];
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'select';
        this.BuildOptions();
    }
    ;
    BuildOptions() {
        var value = this.Properties['value'];
        var selValue = (value !== null && value !== undefined) ? value : "";
        if (this.ControlDef.EmptyOption != null) {
            var emptyOpt = this.ControlDef.EmptyOption;
            let val = "";
            let txt = "";
            if (cUtils.IsString(emptyOpt))
                txt = emptyOpt;
            if (cUtils.IsObject(emptyOpt)) {
                val = emptyOpt.value;
                txt = emptyOpt.text;
            }
            this.Element.add(new Option(txt, val, (selValue == val), (selValue == val)));
        }
        if (this.ControlDef.Options) {
            var options = this.ControlDef.Options;
            if (cUtils.IsObject(options)) {
                Object.getOwnPropertyNames(options).forEach(function (key, idx, array) {
                    let text = options[key];
                    let selected = (key == selValue);
                    var opt = new Option(text, key, selected, selected);
                    opt.setAttribute('data-index', '' + idx);
                    this.Element.add(opt);
                }, this);
            }
            else if (cUtils.IsArray(options)) {
                for (var i = 0; i < options.length; i++) {
                    var item = options[i];
                    var val = item['value'];
                    let text = item['text'];
                    let selected = (val == selValue);
                    var opt = new Option(text, value, selected, selected);
                    opt.setAttribute('data-index', '' + i);
                    opt.setAttribute('data-data', JSON.stringify(item));
                    this.Element.add(opt);
                }
            }
            else {
                this.Element.innerHTML = options;
            }
        }
    }
}
class cTextControl extends cBaseControl {
    constructor(controlDef) {
        super('input', controlDef);
    }
    getPropertiesToIgnore() {
        return ['selectOnFocus'];
    }
    getDataType() {
        if (cUtils.EndsWith(name, 'Date') || cUtils.EndsWith(name, 'On')) {
            return 'date';
        }
        if ((cUtils.EndsWith(name, 'Amount')) || (cUtils.EndsWith(name, 'Amt')) || (cUtils.EndsWith(name, 'Rate')) || (cUtils.EndsWith(name, 'Perc'))) {
            return 'decimal';
        }
        if (cUtils.EndsWith(name, 'Time') || cUtils.EndsWith(name, 'At')) {
            return 'clock';
        }
        if ((cUtils.EndsWith(name, 'Quantity')) || (cUtils.EndsWith(name, 'Qty'))) {
            return 'integer';
        }
    }
    PrepareAdditionalProperties() {
        let dataType = this.ControlDef.dataType;
        if (dataType === undefined) {
            dataType = this.getDataType();
        }
        switch (dataType) {
            case 'integer':
            case 'int':
                this.addClass('integer'); //dataclass-
                //needed? or provide option?
                //this.addAttribute('required', 'required');
                //this.Properties['required'] = 'required';
                //this.Properties['data-msg-digits'] = 'Please enter non decimal number';
                //this.Properties['data-rule-digits'] = 'true';
                break;
            case 'decimal':
                this.addClass('decimal');
                //this.Properties['required'] = 'required';
                //this.Properties['data-msg-number'] = 'Please enter non decimal number';
                //this.Properties['data-rule-number'] = 'true';
                break;
            case 'date':
                this.addClass('datepicker');
                break;
            case 'clock':
                this.addClass('clockpicker');
                break;
        }
        if (this.ControlDef.selectOnFocus === undefined || this.ControlDef.selectOnFocus !== false) {
            this.addClass('select-on-focus');
        }
    }
}
class cPasswordControl extends cBaseControl {
    constructor(controlDef) {
        super('input', controlDef);
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'password';
    }
    getPropertiesToIgnore() {
        return ['selectOnFocus'];
    }
}
class cButtonControl extends cBaseControl {
    constructor(controlDef) {
        super('button', controlDef);
    }
}
//# sourceMappingURL=cFormControls-2.0.js.map