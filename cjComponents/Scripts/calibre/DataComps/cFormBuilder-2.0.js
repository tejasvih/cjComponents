/*
 * cFormBuilder
 * Calibre Technologies
 * Tejasvi Hegde
 * In Plain Vanilla JS, Does not require any other dependant library i.e. jQuery
 * Status: Can run Beta test
 *
 *
 * */
"use strict";
class cFormBuilder {
    constructor(formDef) {
        this.FormDef = {};
        this.Schema = {};
        this.Values = {};
        this.Options = {};
        this.Controls = []; //array is used to preserve sequence... [ control1 ,control2...]
        this.FormLayout = null;
        this.TypeHandlers = {
            'hidden': cHiddenControl,
            'text': cTextControl,
            'radio': cRadioControl,
            'checkbox': cCheckBoxControl,
            'textarea': cTextAreaControl,
            'select': cSelectControl,
            'static': cStaticControl,
            'button': cButtonControl,
            /*'label': this.LabelControl,
            'labelFor': this.LabelForControl,*/
            'html': cHtmlControl
        };
        this.LayoutHandlers = {
            'basic': cFormLayout
            /*'table': this.TableLayout,
            'bootstrap': this.BootstrapLayout,
            'grid': this.GridLayout,
            'bootstrap-material': this.BootstrapMaterialGridLayout,*/
        };
        this.FormDef = formDef;
        if ((this.FormDef) && (this.FormDef.schema != null)) {
            this.Schema = this.FormDef.schema;
        }
        if ((this.FormDef) && (this.FormDef.values != null)) {
            this.Values = this.FormDef.values;
        }
        if ((this.FormDef) && (this.FormDef.options != null)) {
            this.Options = this.FormDef.options;
        }
        this.Build();
        if ((this.FormDef) && (this.FormDef.layout != null)) {
            this.FormLayout = new this.LayoutHandlers[this.FormDef.layout.type](this.Controls);
        }
        if (this.FormLayout == null) {
            this.FormLayout = new this.LayoutHandlers['basic'](this.Controls);
        }
    }
    WriteFormLayoutTo(parentElem, controlNames = null) {
        this.FormLayout.appendTo(parentElem);
        return this;
    }
    WriteControlsTo(parentElem, controlNames = null) {
        for (var i = 0; i < this.Controls.length; i++) {
            var ctl = this.Controls[i];
            ctl.appendTo(parentElem);
        }
        return this;
    }
    getObjectType(name, obj) {
        if (cUtils.EndsWith(name, 'Id') && (obj.options !== undefined)) {
            return 'select';
        }
        else if (cUtils.EndsWith(name, 'Address')) {
            return 'textarea';
        }
        return 'text';
    }
    getControl(name, obj) {
        var ctl = new this.TypeHandlers[obj.type](obj);
        return ctl;
    }
    Build() {
        var schema = this.Schema;
        Object.getOwnPropertyNames(schema).forEach(function (val, idx, array) {
            var obj = schema[val];
            if (obj.type === undefined) {
                obj.type = this.getObjectType(val, obj);
            }
            if (obj['name'] == null) {
                obj['name'] = val;
            }
            if (obj['id'] == null) {
                obj['id'] = val;
            }
            var ctl = this.getControl(val, obj);
            ctl["__schemaName"] = val;
            this.Controls.push(ctl);
            //this.PrepareLabels(val, obj);
            //var html = this.getHtmlForControl(val, obj);
        }, this);
        return this;
    }
}
//# sourceMappingURL=cFormBuilder-2.0.js.map