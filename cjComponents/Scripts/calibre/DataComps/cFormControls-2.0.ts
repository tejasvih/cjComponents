/*
 * cFormControls
 * Calibre Technologies
 * Tejasvi Hegde
 * */
"use strict";

class cBaseControl {

    ControlTag: string;
    ControlDef: any = {};
    IsInlineClosure: boolean = true;
    PropertyMap: any = {};
    ValidationPropertyMap: any = { message: 'data-msg' };
    Properties: any = {};
    PropertiesToIgnore: string[] = ['dataType'];
    //private _value: any = null;
    //private _html: string = '';
    Element: any;
    constructor(controlTag: string, controlDef: any) {
        this.ControlTag = controlTag;
        if (controlDef != null)
            this.ControlDef = controlDef;

        this.PrepareProperties();
        this.Build();
        //this.BuildHtmlObject();
        //this.BuildHtml();
    }
    Build(value: any = null, index: number = null, attribs: any = null, prefix: string = null, suffix: string = null) {
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
    set Value(value: any) {
        //this._value = value;
        this.Element.setAttribute('value', value);
        //this.Element.value = value;
    }
    GetElementContent(value, index, attribs, prefix, suffix) {
        return null;
    }
    PrepareAdditionalProperties() {
        
    }
    /*
    BuildHtml(value: any = null, index: number = null, attribs: any = null, prefix: string = null, suffix: string = null): string {
        let attribHtml: string = '';

        Object.getOwnPropertyNames(this.Properties).forEach(
            function (val, idx, array) {
                //prepare names and ids based on supplied params
                let attribVal: string = (typeof this.Properties[val] === 'string' ? this.Properties[val].replace("\"", "'") : this.Properties[val]);
                switch (val) {
                    case 'name': {
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
                    case 'id': {
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
                    case 'value': {
                        if (value != null) {
                            attribVal = value;
                        }
                    }
                        break;
                }
                if (attribVal != null)
                    attribHtml += val + '="' + attribVal + '" ';

            }, this);
        //Additional attribs
        if (attribs != null) {
            Object.getOwnPropertyNames(attribs).forEach(
                function (val, idx, array) {
                    //prepare names and ids based on supplied params
                    let attribVal: string = (typeof attribs[val] === 'string' ? attribs[val].replace("\"", "'") : attribs[val]);
                    attribHtml += val + '="' + attribVal + '" ';
                }, this);
        }


        if ((this.Properties['value'] == null) && (value != null)) {
            attribHtml += 'value="' + value + '" ';
        }

        var elemContent = this.GetElementContent(value, index, attribs, prefix, suffix);
        if (elemContent != null) {
            this.IsInlineClosure = false;
        }
        if (this.IsInlineClosure) {
            this._html = '<' + this.ControlTag + ' ' + attribHtml + '/>';
        }
        else
            this._html = '<' + this.ControlTag + ' ' + attribHtml + '>' + (elemContent != null ? elemContent : '') + '</' + this.ControlTag + '>';

        return this.Html;
    }
    */
    BuildHtmlObject(value: any = null, index: number = null, attribs: any = null, prefix: string = null, suffix: string = null) {
        //let html: string = this.BuildHtml(value, index, attribs, prefix, suffix);
        
        this.Element = document.createElement(this.ControlTag);

        Object.getOwnPropertyNames(this.Properties).forEach(
            function (val, idx, array) {
                //prepare names and ids based on supplied params
                let attribVal: any = this.Properties[val];//(typeof this.Properties[val] === 'string' ? this.Properties[val].replace("\"", "'") : this.Properties[val]);
                switch (val.toLowerCase()) {
                    case 'name': {
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
                    case 'id': {
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
                    case 'value': {
                        if (value != null) {
                            attribVal = value;
                        }
                    }
                        break;
                }

                if (attribVal != null)
                    this.Element.setAttribute(val, attribVal);

            }, this);

            //Additional attribs
            if (attribs != null) {
                Object.getOwnPropertyNames(attribs).forEach(
                    function (val, idx, array) {
                        //prepare names and ids based on supplied params
                        let attribVal: any = (typeof attribs[val] === 'string' ? attribs[val].replace("\"", "'") : attribs[val]);
                        this.Element.setAttribute(val, attribVal);

                    }, this);
            }


        if (value != null) {
            this.Element.setAttribute('value', value);
            //this.Element.value = value;
        }
        

        var elemContent = this.GetElementContent(value, index, attribs, prefix, suffix);
        if (elemContent != null) {
            this.Element.innerHTML = elemContent;
        }

        return this.Element;
    }
    
    PrepareProperties() {
        this.Properties = {};


        /*Prepare Properties*/
        Object.getOwnPropertyNames(this.ControlDef).forEach(
            function (val, idx, array) {
                if (this.PropertiesToIgnore.indexOf(val) >= 0)
                    return;
                if ((typeof this.ControlDef[val] === 'string') || (typeof this.ControlDef[val] === 'boolean') || (typeof this.ControlDef[val] === 'number')) {
                    let name: string = this.PropertyMap[val] || val;
                    this.Properties[name] = this.ControlDef[name];
                }
            }, this);

        if (this.Properties['id'] == null)
            this.Properties['id'] = this.Properties['name'];

        /*Validation*/
        var validation = this.ControlDef['validation'];
        if (validation) {
            this.Properties['required'] = 'required';
            Object.getOwnPropertyNames(this.ValidationPropertyMap).forEach(
                function (val, idx, array) {
                    if (this.PropertiesToIgnore.indexOf('validation.' + val) >= 0)
                        return;
                    let name: string = this.ValidationPropertyMap[val];
                    this.Properties[name] = validation[val];

                }, this);
        }

        if (this.ControlDef.maxlength !== undefined) {
            this.Properties['data-msg-maxlength'] = 'Maximum allowed is ' + this.ControlDef.maxlength + ' characters/digits';
            this.Properties['data-rule-maxlength'] = this.ControlDef.maxlength;
        }
        if (this.ControlDef.minlength !== undefined) {
            this.Properties['data-msg-minlength'] = 'Minimum required is ' + this.ControlDef.minlength + ' characters/digits';
            this.Properties['data-rule-minlength'] = this.ControlDef.minlength;
        }

        //
        if (this.Properties['readonly'] !== undefined && this.Properties['readonly'] === false) {
            delete this.Properties['readonly'];
        }
        if (this.Properties['disabled'] !== undefined && this.Properties['disabled'] === false) {
            delete this.Properties['disabled'];
        }

        this.PrepareAdditionalProperties();
    }

}

class cHiddenControl extends cBaseControl {

    constructor(controlDef: any) {
        super('input', controlDef);
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'hidden';
    }
}

class cCheckBoxControl extends cBaseControl {

    constructor(controlDef: any) {
        super('input', controlDef);
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'checkbox';
    }
}

class cRadioControl extends cBaseControl {

    constructor(controlDef: any) {
        super('input', controlDef);
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'radio';
    }
}

class cSelectControl extends cBaseControl {

    constructor(controlDef: any) {

        super('select', controlDef);
        this.PropertiesToIgnore.push('url');
        this.PropertiesToIgnore.push('EmptyOption');
        this.PropertiesToIgnore.push('OptionsHtml');
        this.PropertiesToIgnore.push('value');
    }
    GetElementContent(value, index, attribs, prefix, suffix) {

        let optsHtml : string = '';

        if (this.ControlDef.EmptyOption != null) {
            optsHtml += '<option value="">' + this.ControlDef.EmptyOption + '</option>';
        }
        if (this.ControlDef.OptionsHtml) {
            optsHtml += this.ControlDef.OptionsHtml;
        }
        var selValue = value;
        if (this.ControlDef.options) {
            if (typeof this.ControlDef.options === 'object') {
                Object.getOwnPropertyNames(this.ControlDef.options).forEach(
                    function (key, idx, array) {
                        let text : string = this.Instance.ControlDef.options[key];
                        let selected : string = (key == selValue) ? 'selected' : '';
                        optsHtml += '<option value="' + key + '" ' + selected + '>' + text + '</option>';
                    }, this
                );
            }

        }
        return optsHtml;
    }
    PrepareAdditionalProperties() {
        this.Properties['type'] = 'select';

        let url : string = this.ControlDef.url;
        let addnlCls : string = '';
        if (url) {
            addnlCls += 'selectpicker-ajax  selectpicker-live';
            this.Properties['data-abs-ajax-url'] = url;
        }

        if (this.Properties['class'] == null) {
            this.Properties['class'] = '';
        }
        this.Properties['class'] += ' ' + addnlCls;

    };
}

class cTextControl extends cBaseControl {

    constructor(controlDef: any) {
        super('input', controlDef);
        this.PropertiesToIgnore.push('selectOnFocus');
    }
    PrepareAdditionalProperties() {
        let dataType : string = this.ControlDef.dataType;
        if (dataType === undefined) {
            if (EndsWith(name, 'Date') || EndsWith(name, 'On')) {
                dataType = 'date';
            }
            if ((EndsWith(name, 'Amount')) || (EndsWith(name, 'Amt')) || (EndsWith(name, 'Rate')) || (EndsWith(name, 'Perc'))) {
                dataType = 'decimal';
            }
            if (EndsWith(name, 'Time')) {
                dataType = 'clock';
            }
            if ((EndsWith(name, 'Quantity')) || (EndsWith(name, 'Qty'))) {
                dataType = 'integer';
            }
            //
        }
        let dataClass : string = '';
        switch (dataType) {
            case 'integer':
            case 'int':
                dataClass = 'integer';
                this.Properties['required'] = 'required';
                this.Properties['data-msg-digits'] = 'Please enter non decimal number';
                this.Properties['data-rule-digits'] = 'true';
                break;
            case 'decimal':
                dataClass = 'decimal';
                this.Properties['required'] = 'required';
                this.Properties['data-msg-number'] = 'Please enter non decimal number';
                this.Properties['data-rule-number'] = 'true';
                break;
            case 'date':
                dataClass = 'datepicker';

                break;
            case 'clock':
                dataClass = 'clockpicker';
                break;
        }
        if (this.ControlDef.selectOnFocus === undefined || this.ControlDef.selectOnFocus !== false) {
            dataClass += ' select-on-focus';
        }
        if (this.Properties['class'] == null) {
            this.Properties['class'] = '';
        }
        this.Properties['class'] += ' ' + dataClass;
    }
}
