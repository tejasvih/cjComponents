/*
 * cLayout
 * Calibre Technologies
 * Tejasvi Hegde
 * In Plain Vanilla JS, Does not require any other dependant library i.e. jQuery
 * Status: Alpha
 * */
"use strict";

/*
TODO: implement columnWidths
*/
/*
 controlDef =
{
    options : {...options for layout}
    rows : [{rows definitions...}]
}

rowDefinition = 
{
    options : {...options for this row}
    columns : [{column definitions...}]
}

colDefinition =
{
    options : {...options for this column}
    controls : [list of controls] or single control
}

e.g:

var idText = builder.textBox();
    
    var controlDef =
    {
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
                HtmlClass: 'col-md-4 bordered'
            }

        },
        options: {
            class: 'yellowbg',
            columnWidths : [1,3,4,"10px"]
        },
        rows: [
            {
                options: {
                    class: 'redbg',
                    columnWidths : [2,2,2,"100px"]
                },
                columns: [
                    {
                        options: {},
                        controls: [
                            builder.checkBox(),
                            idText, //can use instance variable
                            "A text",
                            100,
                            true
                        ]
                    },

                    {
                        options: {
                            class: 'greenbg'
                        },

                        //if its direct control, can also specify single control
                        controls: builder.select()
                    },
                    {
                        options: {},
                        controls: [
                            builder.radio(),
                            builder.textBox(),
                            idText //reusing same control instance variable will move the control from earlier position to here!!! only one instance variables are possible
                        ]
                    }
                ]
            },
            {
                options: {},
                columns: [
                    {
                        options: {},
                        //single control can be added
                        control: builder.textArea()

                    },
                    {
                        options: {},
                        //both can be added. but first control is added then controls
                        control: builder.textArea(),
                        controls: [
                            builder.select()
                        ]
                    },
                    {
                        options: {},
                        controls: [
                            builder.radio(),
                            builder.textBox()
                        ]
                    }
                ]
            },
            {
                //shortcut.. creates column for each control and adds control in that column
                columns: [
                    builder.checkBox(),
                    builder.select(),
                    builder.radio(),
                    builder.textBox()
                ]
            },
        ]
    }
    var layout = new cLayout(controlDef);
    layout.appendTo(container);

*/

class cLayoutBase {

    defaultDefs: any = {
        layout: {
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
    Parent: cLayoutBase = null;
    Element: any;
    ControlDef: any = {};
    //Children: any[] = [] //need to save children ? consumes memory
    
    constructor(controlDef: any, parent: cLayoutBase = null) {
        this.ControlDef = controlDef;
        this.Parent = parent;
    }
    getParentLayout() {
        if (this instanceof cLayout)
            return this;

        return this.Parent.getParentLayout();
        /*let parentLayout = null;
        while (this.Parent != null) {
            parentLayout = this.Parent.getParentLayout()
        }
        return parentLayout;*/
    }
    Build() {
        this.applyDefaultDefs();
        this.ParseOptions();

        this.Element = document.createElement(this.ControlDef.Htmltag);
        cUtils.addClass(this.Element, this.ControlDef.HtmlClass);

        if (this.ControlDef.options) {
            cUtils.addClass(this.Element, this.ControlDef.options.class);
        }
        
        return this;
    }
    ParseOptions() {
        //options
        //parse defaultDefs if exists
        return this;
    }
    appendTo(parentElem) {
        cUtils.appendTo(parentElem, this.Element);
        return this;
    }
    writeTo(parentElem) {
        cUtils.writeTo(parentElem, this.Element);
        return this;
    }
    applyDefaultDefs() {

        if (!this.ControlDef.defaultDefs)
            this.ControlDef.defaultDefs = this.defaultDefs;

        //cUtils.copyIfNoExists(this.defaultDefs, this.ControlDef.defaultDefs);
        //cUtils.copyIfNoExists(this.defaultDefs.column, this.ControlDef);
    }
    
}

class cColumn extends cLayoutBase  {

    constructor(controlDef: any, index: number, parent: cLayoutBase) {
        super(controlDef, parent);
        

    }
    applyDefaultDefs() {
        super.applyDefaultDefs();

        let defLayout = this.getParentLayout().ControlDef.defaultDefs;
        cUtils.copyIfNoExists(defLayout.column, this.ControlDef);
        //cUtils.copyIfNoExists(this.Parent.ControlDef.defaultDefs.column, this.ControlDef);

    }
    Build() {
        super.Build();
        if (cBaseControl.isBaseControl(this.ControlDef)) {
            cUtils.appendTo(this.Element, this.ControlDef.Element);
        }
        else {
            let ctrls = [];
            if (this.ControlDef.control) {
                ctrls.push(this.ControlDef.control);
            }
            if (this.ControlDef.controls) {
                if (cUtils.IsArray(this.ControlDef.controls))
                    ctrls = [...ctrls, ...this.ControlDef.controls];
                else 
                    ctrls.push(this.ControlDef.controls);
            }
            for (var i = 0; i < ctrls.length; i++) {
                let ctrl = ctrls[i];
                this.addControl(ctrl);
            }
        }
        return this;
    }
    ParseOptions() {

        return this;
    }
    addControl(ctl) {
        if (cBaseControl.isBaseControl(ctl)) {
            //control
            cUtils.appendTo(this.Element, ctl.Element);
        }
        if (cUtils.IsObject(ctl)) {
            //object... do nothing, or print JSON/toString ?
        }
        else {
            //text
            let txtNode = document.createTextNode(ctl);
            cUtils.appendTo(this.Element, txtNode);
        }
    }
}

class cRow extends cLayoutBase  {

    constructor(controlDef: any, index: number, parent: cLayoutBase) {
        super(controlDef, parent);
        
    }
    applyDefaultDefs() {
        super.applyDefaultDefs();
        let defLayout = this.getParentLayout().ControlDef.defaultDefs;
        cUtils.copyIfNoExists(defLayout.row, this.ControlDef);

    }
    Build() {
        super.Build();
        if (this.ControlDef.columns) {
            let cols = this.ControlDef.columns;
            for (var i = 0; i < cols.length; i++) {
                let col = cols[i];
                let colObject = new cColumn(col, i, this).Build();
                cUtils.appendTo(this.Element, colObject.Element);
            }
        }
        return this;
    }
    ParseOptions() {

        return this;
    }
}

class cLayout extends cLayoutBase {

    constructor(controlDef: any) {
        super(controlDef);
    }
    Build() {
        super.Build();
        if (this.ControlDef.rows) {
            let rows = this.ControlDef.rows;
            for (var i = 0; i < rows.length; i++) {
                let row = rows[i];
                let rowObject = new cRow(row,  i,this).Build();
                cUtils.appendTo(this.Element, rowObject.Element);
            }
        }
        return this;
    }
    applyDefaultDefs() {
        super.applyDefaultDefs();
        cUtils.copyIfNoExists(this.ControlDef.defaultDefs.layout, this.ControlDef);
        
    }
    ParseOptions() {

        return this;
    }

    appendTo(parentElem) {
        cUtils.appendTo(parentElem, this.Element);
        return this;
    }
    writeTo(parentElem) {
        cUtils.writeTo(parentElem, this.Element);
        return this;
    }
}

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
}