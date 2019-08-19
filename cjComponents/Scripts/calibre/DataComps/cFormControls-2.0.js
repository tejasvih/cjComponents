/*
 * cFormControls
 * Calibre Technologies
 * Tejasvi Hegde
 * */
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var cBaseControl = /** @class */ (function () {
    function cBaseControl(controlTag, controlDef) {
        this.ControlDef = {};
        this.IsInlineClosure = true;
        this.PropertyMap = {};
        this.ValidationPropertyMap = { message: 'data-msg' };
        this.Properties = {};
        this.PropertiesToIgnore = ['dataType'];
        this.ControlTag = controlTag;
        if ((controlDef != null) && (controlDef != undefined))
            this.ControlDef = controlDef;
        this.PrepareProperties();
        this.Build();
        //this.BuildHtmlObject();
        //this.BuildHtml();
    }
    cBaseControl.prototype.Build = function (value, index, attribs, prefix, suffix) {
        if (value === void 0) { value = null; }
        if (index === void 0) { index = null; }
        if (attribs === void 0) { attribs = null; }
        if (prefix === void 0) { prefix = null; }
        if (suffix === void 0) { suffix = null; }
        this.BuildHtmlObject(value, index, attribs, prefix, suffix);
        return this;
    };
    Object.defineProperty(cBaseControl.prototype, "Html", {
        get: function () {
            var wrap = document.createElement('div');
            wrap.appendChild(this.Element.cloneNode(true));
            return wrap.innerHTML;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cBaseControl.prototype, "Value", {
        get: function () {
            return this.Element.value;
        },
        set: function (value) {
            //this._value = value;
            this.Element.setAttribute('value', value);
            //this.Element.value = value;
        },
        enumerable: true,
        configurable: true
    });
    cBaseControl.prototype.GetElementContent = function (value, index, attribs, prefix, suffix) {
        return null;
    };
    cBaseControl.prototype.PrepareAdditionalProperties = function () {
    };
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
    cBaseControl.prototype.BuildHtmlObject = function (value, index, attribs, prefix, suffix) {
        //let html: string = this.BuildHtml(value, index, attribs, prefix, suffix);
        if (value === void 0) { value = null; }
        if (index === void 0) { index = null; }
        if (attribs === void 0) { attribs = null; }
        if (prefix === void 0) { prefix = null; }
        if (suffix === void 0) { suffix = null; }
        this.Element = document.createElement(this.ControlTag);
        Object.getOwnPropertyNames(this.Properties).forEach(function (val, idx, array) {
            //prepare names and ids based on supplied params
            var attribVal = this.Properties[val]; //(typeof this.Properties[val] === 'string' ? this.Properties[val].replace("\"", "'") : this.Properties[val]);
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
                this.Element.setAttribute(val, attribVal);
        }, this);
        //Additional attribs
        if (attribs != null) {
            Object.getOwnPropertyNames(attribs).forEach(function (val, idx, array) {
                //prepare names and ids based on supplied params
                var attribVal = (typeof attribs[val] === 'string' ? attribs[val].replace("\"", "'") : attribs[val]);
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
    };
    cBaseControl.prototype.PrepareProperties = function () {
        this.Properties = {};
        /*Prepare Properties*/
        Object.getOwnPropertyNames(this.ControlDef).forEach(function (val, idx, array) {
            if (this.PropertiesToIgnore.indexOf(val) >= 0)
                return;
            if ((typeof this.ControlDef[val] === 'string') || (typeof this.ControlDef[val] === 'boolean') || (typeof this.ControlDef[val] === 'number')) {
                var name_1 = this.PropertyMap[val] || val;
                this.Properties[name_1] = this.ControlDef[name_1];
            }
        }, this);
        if (this.Properties['id'] == null)
            this.Properties['id'] = this.Properties['name'];
        /*Validation*/
        var validation = this.ControlDef['validation'];
        if (validation) {
            this.Properties['required'] = 'required';
            Object.getOwnPropertyNames(this.ValidationPropertyMap).forEach(function (val, idx, array) {
                if (this.PropertiesToIgnore.indexOf('validation.' + val) >= 0)
                    return;
                var name = this.ValidationPropertyMap[val];
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
    };
    return cBaseControl;
}());
var cHiddenControl = /** @class */ (function (_super) {
    __extends(cHiddenControl, _super);
    function cHiddenControl(controlDef) {
        return _super.call(this, 'input', controlDef) || this;
    }
    cHiddenControl.prototype.PrepareAdditionalProperties = function () {
        this.Properties['type'] = 'hidden';
    };
    return cHiddenControl;
}(cBaseControl));
var cCheckBoxControl = /** @class */ (function (_super) {
    __extends(cCheckBoxControl, _super);
    function cCheckBoxControl(controlDef) {
        return _super.call(this, 'input', controlDef) || this;
    }
    cCheckBoxControl.prototype.PrepareAdditionalProperties = function () {
        this.Properties['type'] = 'checkbox';
    };
    return cCheckBoxControl;
}(cBaseControl));
var cRadioControl = /** @class */ (function (_super) {
    __extends(cRadioControl, _super);
    function cRadioControl(controlDef) {
        return _super.call(this, 'input', controlDef) || this;
    }
    cRadioControl.prototype.PrepareAdditionalProperties = function () {
        this.Properties['type'] = 'radio';
    };
    return cRadioControl;
}(cBaseControl));
var cSelectControl = /** @class */ (function (_super) {
    __extends(cSelectControl, _super);
    function cSelectControl(controlDef) {
        var _this = _super.call(this, 'select', controlDef) || this;
        _this.PropertiesToIgnore.push('url');
        _this.PropertiesToIgnore.push('EmptyOption');
        _this.PropertiesToIgnore.push('OptionsHtml');
        _this.PropertiesToIgnore.push('value');
        return _this;
    }
    cSelectControl.prototype.GetElementContent = function (value, index, attribs, prefix, suffix) {
        var optsHtml = '';
        if (this.ControlDef.EmptyOption != null) {
            optsHtml += '<option value="">' + this.ControlDef.EmptyOption + '</option>';
        }
        if (this.ControlDef.OptionsHtml) {
            optsHtml += this.ControlDef.OptionsHtml;
        }
        var selValue = value;
        if (this.ControlDef.options) {
            if (typeof this.ControlDef.options === 'object') {
                Object.getOwnPropertyNames(this.ControlDef.options).forEach(function (key, idx, array) {
                    var text = this.Instance.ControlDef.options[key];
                    var selected = (key == selValue) ? 'selected' : '';
                    optsHtml += '<option value="' + key + '" ' + selected + '>' + text + '</option>';
                }, this);
            }
        }
        return optsHtml;
    };
    cSelectControl.prototype.PrepareAdditionalProperties = function () {
        this.Properties['type'] = 'select';
        var url = this.ControlDef.url;
        var addnlCls = '';
        if (url) {
            addnlCls += 'selectpicker-ajax  selectpicker-live';
            this.Properties['data-abs-ajax-url'] = url;
        }
        if (this.Properties['class'] == null) {
            this.Properties['class'] = '';
        }
        this.Properties['class'] += ' ' + addnlCls;
    };
    ;
    return cSelectControl;
}(cBaseControl));
var cTextControl = /** @class */ (function (_super) {
    __extends(cTextControl, _super);
    function cTextControl(controlDef) {
        var _this = _super.call(this, 'input', controlDef) || this;
        _this.PropertiesToIgnore.push('selectOnFocus');
        return _this;
    }
    cTextControl.prototype.PrepareAdditionalProperties = function () {
        var dataType = this.ControlDef.dataType;
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
    };
    return cTextControl;
}(cBaseControl));
//# sourceMappingURL=cFormControls-2.0.js.map