/*
 * cFormLayout
 * Calibre Technologies
 * Tejasvi Hegde
 * In Plain Vanilla JS, Does not require any other dependant library i.e. jQuery
 * Status: Alpha
 * */
"use strict";



class cFormLayoutBase {

    LayoutDef: any = {
        layoutContainer: {
            Htmltag: 'div',
            HtmlClass: 'c-layout'
        },
        row: {
            Htmltag: 'div',
            HtmlClass: 'c-row'
        },
        column: {
            Htmltag: 'div',
            HtmlClass: 'c-column'
        }
        
    };

    LayoutContainer: cContainerControl = null;
    Parent: cFormLayoutBase = null;
    //Element: any;
    Controls: any[] = [];
    //Children: any[] = [] //need to save children ? consumes memory


    currentRow: any = null;
    currentCol: any = null;
    constructor(controls: any[], parent: cFormLayoutBase = null) {
        this.Controls = controls;
        this.Parent = parent;
        
    }
    applyDefaults() {

    }
    addRow() {
        var row = this.getNewRow();
        this.currentRow = row;
        this.LayoutContainer.AddChild(row);
    }
    addColumn(config) {
        var col = this.getNewColumn(config);
        this.currentCol = col;
        this.currentRow.AddChild(col);
    }
    addControl(ctl) {
        if (this.currentCol != null) {
            this.currentCol.AddChild(ctl);
        }
        else {
            if (this.currentRow != null) {
                this.currentRow.AddChild(ctl);
            }
            else {
                if (this.LayoutContainer != null) {
                    this.LayoutContainer.AddChild(ctl);
                }
            }
        }
        
    }
    applyAdditionalControlProperties(ctl) {
        
    }
    getNewRow() {
        return new cContainerControl({ class: this.LayoutDef.row.HtmlClass }, this.LayoutDef.row.Htmltag);
    }
    getNewColumn(config) {
        return new cContainerControl({ class: this.LayoutDef.column.HtmlClass }, this.LayoutDef.column.Htmltag);
    }
    getLabelControl(ctl) {
        
            var labelDef = { text: '', config: {} };
        if (ctl.Config.width != null) {
            labelDef.config['width'] = ctl.Config.width;
            }
            else {

            if (ctl.Config.lo != null)
                labelDef.config['o'] = ctl.Config.lo;
            if (ctl.Config.lw != null)
                labelDef.config['w'] = ctl.Config.lw;
            }
        labelDef.text = ctl.Config.title + ((ctl.ControlDef.required && (!ctl.Config.noRequiredIndicator)) ? '&nbsp;<small style="color:red;">*</small>' : '');
            return new cLabelControl(labelDef);
    }
    GetDisplayControl(ctl) {
        //option to prepare group of controls
        return ctl;
    }
    Build() {
        this.applyDefaults();
        this.LayoutContainer = new cContainerControl({ class: this.LayoutDef.layoutContainer.HtmlClass }, this.LayoutDef.layoutContainer.Htmltag);
        this.addRow(); //add first row
        
        for (var i = 0; i < this.Controls.length; i++) {
            var ctl = this.Controls[i];
            //var ctlDef = ctl.ControlDef || {};
            //var config = ctlDef.config || {};
            var config = ctl.Config;
            if (config.isNewRow != null && config.isNewRow) {
                this.addRow();
            }
            let isDirectControl = (config.directControl != null) && (config.directControl == true);
            
            if (!isDirectControl) {

                if (!config.noLabel) {
                    var lblControl = this.getLabelControl(ctl);
                    this.addColumn(lblControl.Config);
                    this.applyAdditionalControlProperties(lblControl);
                    this.addControl(this.GetDisplayControl(lblControl));
                }
                this.addColumn(config); 
            }
            this.applyAdditionalControlProperties(ctl);
            this.addControl(this.GetDisplayControl(ctl));
        }
        return this;
    }

    appendTo(parentElem) {
        cUtils.appendTo(parentElem, this.LayoutContainer.Element);
        return this;
    }
    writeTo(parentElem) {
        cUtils.writeTo(parentElem, this.LayoutContainer.Element);
        return this;
    }
    
    
}

class cFormLayout extends cFormLayoutBase {

    constructor(controls: any[], parent: cFormLayoutBase = null) {
        super(controls, parent);
    }
}

class cFormTableLayout extends cFormLayoutBase {

   

    constructor(controls: any[], parent: cFormLayoutBase = null) {
        super(controls, parent);
    }

    applyDefaults() {

        this.LayoutDef = {
            layoutContainer: {
                Htmltag: 'table',
                HtmlClass: 'table'
            },
            row: {
                Htmltag: 'tr',
                HtmlClass: ''
            },
            column: {
                Htmltag: 'td',
                HtmlClass: ''
            }

        };
    }
    //todo widths to colspan
}
class cFormBootStrapLayout extends cFormLayoutBase {

    constructor(controls: any[], parent: cFormLayoutBase = null) {
        super(controls, parent);
    }
    AdditionalControlProperties = {
        'text': { class : 'form-control'},
        'radio': { class: 'form-control' },
        'textarea': { class: 'form-control' },
        'select': { class: 'form-control' },
    };
    applyDefaults() {

        this.LayoutDef = {
            layoutContainer: {
                Htmltag: 'div',
                HtmlClass: 'container'
            },
            row: {
                Htmltag: 'div',
                HtmlClass: 'row'
            },
            column: {
                Htmltag: 'div',
                HtmlClass: ''
            }

        };
    }

    getNewColumn(config) {
        var newctl = new cContainerControl({ class: this.LayoutDef.column.HtmlClass }, this.LayoutDef.column.Htmltag);
        var widthClass = this.GetSizeClass(config);
        newctl.addClass(widthClass);
        return newctl;
    }
    GetSizeClass(config: any, defWidth: number = 1) {
        var width = config.width;
        let str = '';
        if (width != null) {
            //todo Untested!
            Object.getOwnPropertyNames(width).forEach(
                function (val, idx, array) {
                    str += ' col-' + val + '-' + width[val];
                }, this);
            
        }
        else {
            if (config.w != null)
                str = 'col-' + config.w;
            if ((config.o != null) && (config.o != 0))
                str += ' offset-md-' + config.o;
            
        }
        return str;// == '' ? 'col' : str;
    }
    applyAdditionalControlProperties(ctl) {
        super.applyAdditionalControlProperties(ctl);

        var prop = this.AdditionalControlProperties[ctl.ControlDef.type];
        if (prop != null) {
            ctl.addClass(prop.class);
        }
    }
    getLabelControl(ctl) {
        
        var labelDef = { text: '', config: {}, class: 'label-on-left' };
        if (ctl.Config.width != null) {
            labelDef.config['width'] = ctl.Config.width;
        }
        else {

            if (ctl.Config.lo != null)
                labelDef.config['o'] = ctl.Config.lo;
            if (ctl.Config.lw != null)
                labelDef.config['w'] = ctl.Config.lw;
            else
                labelDef.config['w'] = 1;
        }
        labelDef.text = ctl.Config.title + ((ctl.ControlDef.required && (!ctl.Config.noRequiredIndicator)) ? '&nbsp;<small style="color:red;">*</small>' : '');
        return new cLabelControl(labelDef);
    }
    GetDisplayControl(ctl) {
        //todo... prepare structured group .. to continue...
        var ctlGrp = new cContainerControl({ class: 'form-group' });
        ctlGrp.AddChild(ctl);
        return ctlGrp;
    }
}
class cFormBootStrapFluidLayout extends cFormBootStrapLayout {

    constructor(controls: any[], parent: cFormLayoutBase = null) {
        super(controls, parent);
    }

    applyDefaults() {
        super.applyDefaults();
        this.LayoutDef.layoutContainer.HtmlClass = 'container-fluid';
    }
}


/*
 if (helpText && helpText != '') {
                    if ((obj.type === 'text') || (obj.type === 'textarea') || (obj.type === 'select')) {
                        helpHtml = '<label class="help-block">' + helpText + '</label>';
                    }

                }
 


  
 * */