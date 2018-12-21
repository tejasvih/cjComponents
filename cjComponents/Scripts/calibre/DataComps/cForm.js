"use strict";
function EndsWith(text, word) {
    var diff = text.length - word.length;
    if (diff < 0)
        return false;
    return (text.lastIndexOf(word) === diff);
}

function cForm() {

    this.Controls = {};

    //Init
    this.Controls['text'] = cTextControl;
    return this;
}

function cHiddenControl(controlDef) {
    var parent = new cBaseControl('input', controlDef);
    this.Instance = parent.Instance;
    this.Instance.OnExtendedProperties = function () {
        this.Instance.Properties['type'] = 'hidden';
    };
    this.Instance.PrepareProperties();
    //this.Instance.IsInlineClosure = false;
    this.Instance.BuildHtml();
    return this.Instance;
}
function cCheckBoxControl(controlDef) {
    var parent = new cBaseControl('input', controlDef);
    this.Instance = parent.Instance;
    this.Instance.OnExtendedProperties = function () {
        this.Instance.Properties['type'] = 'checkbox';
    };
    this.Instance.PrepareProperties();
    this.Instance.BuildHtml();
    return this.Instance;
}
function cRadioControl(controlDef) {
    var parent = new cBaseControl('input', controlDef);
    this.Instance = parent.Instance;
    this.Instance.OnExtendedProperties = function () {
        this.Instance.Properties['type'] = 'radio';
    };
    this.Instance.PrepareProperties();
    this.Instance.BuildHtml();
    return this.Instance;
}
function cSelectControl(controlDef) {
    var parent = new cBaseControl('select', controlDef);
    this.Instance = parent.Instance;

    this.Instance.PropertiesToIgnore.push('url');
    this.Instance.PropertiesToIgnore.push('EmptyOption');
    this.Instance.PropertiesToIgnore.push('OptionsHtml');
    this.Instance.PropertiesToIgnore.push('value');
    
    this.Instance.OnGetElementContent = function (value, index, attribs, prefix, suffix) {

        var optsHtml = '';

        if (this.Instance.ControlDef.EmptyOption != null) {
            optsHtml += '<option value="">' + this.Instance.ControlDef.EmptyOption + '</option>';
        }
        if (this.Instance.ControlDef.OptionsHtml) {

            optsHtml += this.Instance.ControlDef.OptionsHtml;
        }
        var selValue = value;
        if (this.Instance.ControlDef.options) {
            if (typeof this.Instance.ControlDef.options === 'object') {
                Object.getOwnPropertyNames(this.Instance.ControlDef.options).forEach(
                    function (key, idx, array) {
                        var text = this.Instance.ControlDef.options[key];
                        var selected = (key == selValue) ? 'selected' : '';
                        optsHtml += '<option value="' + key + '" ' + selected + '>' + text + '</option>';
                    }, this
                );
            }

        }
        return optsHtml;
    };

    this.Instance.OnExtendedProperties = function () {
        this.Instance.Properties['type'] = 'select';

        var url = this.Instance.ControlDef.url;
        var addnlCls = '';
        if (url) {
            addnlCls += 'selectpicker-ajax  selectpicker-live';
            this.Instance.Properties['data-abs-ajax-url'] = url;
        }

        if (this.Instance.Properties['class'] == null) {
            this.Instance.Properties['class'] = '';
        }
        this.Instance.Properties['class'] += ' ' + addnlCls;

    };
    this.Instance.PrepareProperties();
    this.Instance.BuildHtml();
    return this.Instance;
}
function cTextControl(controlDef) {
    var parent = new cBaseControl('input', controlDef);
    this.Instance = parent.Instance;
    this.Instance.PropertiesToIgnore.push('selectOnFocus');

    this.Instance.OnExtendedProperties = function () {

        var dataType = this.Instance.ControlDef.dataType;
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
        var dataClass = '';
        switch (dataType) {
            case 'integer':
            case 'int':
                dataClass = 'integer';
                this.Instance.Properties['required'] = 'required';
                this.Instance.Properties['data-msg-digits'] = 'Please enter non decimal number';
                this.Instance.Properties['data-rule-digits'] = 'true';
                break;
            case 'decimal':
                dataClass = 'decimal';
                this.Instance.Properties['required'] = 'required';
                this.Instance.Properties['data-msg-number'] = 'Please enter non decimal number';
                this.Instance.Properties['data-rule-number'] = 'true';
                break;
            case 'date':
                dataClass = 'datepicker';

                break;
            case 'clock':
                dataClass = 'clockpicker';
                break;
        }
        if (this.Instance.Instance.ControlDef.selectOnFocus === undefined || obj.selectOnFocus !== false) {
            dataClass += ' select-on-focus';
        }
        if (this.Instance.Properties['class'] == null) {
            this.Instance.Properties['class'] = '';
        }
        this.Instance.Properties['class'] += ' ' + dataClass;


    };

    this.Instance.PrepareProperties();
    this.Instance.BuildHtml();
    return this.Instance;
}
function cBaseControl(type, controlDef) {
    //{name : "",....}

    this.Instance = this; //call methods from this property. to support inheritence
    this.Type = type;
    this.ControlDef = controlDef;
    this.IsInlineClosure = true;
    this.PropertyMap = {};
    this.ValidationPropertyMap = { message: 'data-msg' };
    this.Properties = {};
    this.PropertiesToIgnore = ['dataType'];
    this.Value;
    this.Html;
    this.OnGetElementContent = function () {
        return null;
    };
    this.OnExtendedProperties = function () {
    };
    this.GetValue = function () {
        return this.Value;
    };
    this.SetValue = function (value) {
        this.Value = value;
        this.Properties['value'] = value;
    };
    this.BuildHtml = function (value,index, attribs,prefix, suffix) {
        var html = '';

        Object.getOwnPropertyNames(this.Properties).forEach(
            function (val, idx, array) {
                //prepare names and ids based on supplied params
                var attribVal = (typeof this.Properties[val] === 'string' ? this.Properties[val].replace("\"", "'") : this.Properties[val]);
                switch (val) {
                    case 'name': {
                        if (index != null) {
                            if (prefix != null) {
                                attribVal = prefix+ '[' + index + '].' + attribVal;
                            }
                            else
                                attribVal = attribVal + '[' + index + ']';
                        }
                        if (prefix != null) {
                            if (index == null)
                                attribVal = prefix + '.' + attribVal;
                        }
                        if (suffix != null) {
                            attribVal = attribVal + '.'+ suffix;
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
                            attribVal = prefix + '_'+ attribVal;
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
                    html += val + '="' + attribVal + '" ';

            }, this);
        //Additional attribs
        if (attribs != null) {
            Object.getOwnPropertyNames(attribs).forEach(
                function (val, idx, array) {
                    //prepare names and ids based on supplied params
                    var attribVal = (typeof attribs[val] === 'string' ? attribs[val].replace("\"", "'") : attribs[val]);
                    html += val + '="' + attribVal + '" ';
                }, this);
        }
        

        if ((this.Properties['value'] == null) && (value != null)) {
            html += 'value="' + value + '" ';
        }

        var elemContent = this.OnGetElementContent(value, index, attribs, prefix, suffix);
        if (elemContent != null) {
            this.IsInlineClosure = false;
        }
        if (this.IsInlineClosure) {
            this.Html = '<' + this.Type + ' ' + html + '/>';
        }
        else
            this.Html = '<' + this.Type + ' ' + html + '>' + (elemContent != null ? elemContent : '')+'</' + this.Type + '>';

        return this.Html;
    };
    this.BuildHtmlObject = function (value, index, prefix, suffix) {
        var html = this.BuildHtml(value, index, prefix, suffix);
        //TODO
    }

    this.PrepareProperties = function () {
        this.Properties = {};


        /*Prepare Properties*/
        Object.getOwnPropertyNames(this.ControlDef).forEach(
            function (val, idx, array) {
                if (this.PropertiesToIgnore.indexOf(val) >= 0)
                    return;
                if ((typeof this.ControlDef[val] === 'string') || (typeof this.ControlDef[val] === 'boolean') || (typeof this.ControlDef[val] === 'number')) {
                    var name = this.PropertyMap[val] || val;
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
                    var name = this.ValidationPropertyMap[val];
                    this.Properties[name] = validation[val];

                }, this);
        }
        /*if (this.Properties['class'] === undefined) {
            this.Properties['class'] = '';
        }*/
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

        this.OnExtendedProperties();
    };

    //Init
    //this.PrepareProperties();
    return this;
}
