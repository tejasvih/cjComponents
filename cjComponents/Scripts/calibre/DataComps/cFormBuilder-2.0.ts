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
    Contros: any = {};

    TypeHandlers = {
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
   /* LayoutHandlers = {
        'table': this.TableLayout,
        'bootstrap': this.BootstrapLayout,
        'grid': this.GridLayout,
        'bootstrap-material': this.BootstrapMaterialGridLayout,
    };
    */

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
    }

    WriteControlsTo(parentElem, controlNames = null) {
        Object.getOwnPropertyNames(this.Contros).forEach(
            function (val, idx, array) {
                var ctl = this.Contros[val];
                ctl.appendTo(parentElem);

            }, this);
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
        //https://stackoverflow.com/questions/17382143/create-a-new-object-from-type-parameter-in-generic-class
        var ctl = new this.TypeHandlers[obj.type](obj);
        return ctl;
    }
    Build() {
        //todo
        var schema = this.Schema;
        Object.getOwnPropertyNames(schema).forEach(
            function (val, idx, array) {
                var obj = schema[val];
                if (obj.type === undefined) {
                    obj.type = this.getObjectType(val, obj);
                }
                var ctl = this.getControl(val, obj);
                this.Contros[val] = ctl;
                
                //this.PrepareLabels(val, obj);
                //var html = this.getHtmlForControl(val, obj);
                
            }, this);
        return this;
    }
   
}
