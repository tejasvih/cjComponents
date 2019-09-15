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
        this.Build();
    }

    addRow() {
        var row = this.getNewRow();
        this.currentRow = row;
        this.LayoutContainer.AddChild(row);
    }
    addColumn() {
        var col = this.getNewColumn();
        this.currentCol = col;
        this.currentRow.AddChild(col);
    }
    addControl(ctl) {
        this.currentCol.AddChild(ctl);
    }
    getNewRow() {
        return new cContainerControl({ class: this.LayoutDef.row.HtmlClass }, this.LayoutDef.row.Htmltag);
    }
    getNewColumn() {
        return new cContainerControl({ class: this.LayoutDef.column.HtmlClass }, this.LayoutDef.column.Htmltag);
    }
    Build() {
        this.LayoutContainer = new cContainerControl({ class: this.LayoutDef.layoutContainer.HtmlClass }, this.LayoutDef.layoutContainer.Htmltag);
        this.addRow(); //add first row
        
        for (var i = 0; i < this.Controls.length; i++) {
            var ctl = this.Controls[i];
            var ctlDef = ctl.ControlDef || {};
            var config = ctlDef.config || {};
            if (config.isNewRow != null && config.isNewRow) {
                this.addRow();
            }
            this.addColumn(); 
            this.addControl(ctl);
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
/*
class cBootstrapLayout extends cLayout {

    defaultDefs: any = {
        layout: {
            Htmltag: 'div',
            HtmlClass: 'container'
        },
        row: {
            Htmltag: 'div',
            HtmlClass: 'row'
        },
        column: {
            Htmltag: 'div',
            HtmlClass: 'col-md-2'
        }

    };
}

class cTableLayout extends cLayout {

    defaultDefs: any = {
        layout: {
            Htmltag: 'table',
            HtmlClass: 'table table-hover table-bordered'
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
}*/