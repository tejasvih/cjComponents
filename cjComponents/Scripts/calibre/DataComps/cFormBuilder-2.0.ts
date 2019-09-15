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
    FormDef: any = {};
    Schema: any = {};
    Values: any = {};
    Options: any = {};
    Controls: any[] = []; //array is used to preserve sequence... [ control1 ,control2...]
    FormLayout: cFormLayoutBase = null;
    TypeHandlers = {
        'hidden': cHiddenControl,
        'text': cTextControl,
        'radio': cRadioControl,
        'checkbox': cCheckBoxControl,
        'textarea': cTextAreaControl,
        'select': cSelectControl,
        'static': cStaticControl,
        'button': cButtonControl,
        'label': cLabelControl,
    /*'labelFor': this.LabelForControl,*/
        'html': cHtmlControl
    };
    LayoutHandlers = {
        'basic': cFormLayout,
        'table': cFormTableLayout,
        'bootstrap': cFormBootStrapLayout,
        'bootstrap-fluid': cFormBootStrapFluidLayout,
        
        /*'grid': this.GridLayout,
        'bootstrap-material': this.BootstrapMaterialGridLayout,*/
    };
    

    constructor(formDef: any) {
        this.FormDef = formDef;
        if ((this.FormDef) && (this.FormDef.schema != null)) {
            this.Schema = this.FormDef.schema
        }
        if ((this.FormDef) && (this.FormDef.values != null)) {
            this.Values = this.FormDef.values
        }
        if ((this.FormDef) && (this.FormDef.options != null)) {
            this.Options = this.FormDef.options
        }
        this.Build();
        if ((this.FormDef) && (this.FormDef.layout != null)) {
            this.FormLayout = new this.LayoutHandlers[this.FormDef.layout.type](this.Controls);
        }
        if (this.FormLayout == null) {
            this.FormLayout = new this.LayoutHandlers['basic'](this.Controls);
        }
        this.FormLayout.Build();
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
        Object.getOwnPropertyNames(schema).forEach(
            function (name, idx, array) {
                var obj = schema[name];
                if (obj.type === undefined) {
                    obj.type = this.getObjectType(name, obj);
                }

                if (obj['Name'] == null) {
                    obj['Name'] = name;
                }
                if (obj['Id'] == null) {
                    obj['Id'] = name;
                }
                 
                var ctl = this.getControl(name, obj);

                ctl["__schemaName"] = name;

                this.Controls.push(ctl);
                
            }, this);
        return this;
    }
   
}
