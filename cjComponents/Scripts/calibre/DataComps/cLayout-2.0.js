/*
 * cLayout
 * Calibre Technologies
 * Tejasvi Hegde
 * In Plain Vanilla JS, Does not require any other dependant library i.e. jQuery
 * */
"use strict";
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
        options: {},
        rows: [
            {
                options: {},
                columns: [
                    {
                        options: {},
                        controls: [
                            builder.checkBox(),
                            idText
                        ]
                    },
                    {
                        options: {},
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
                options: {},
                columns: [
                    {
                        options: {},
                        controls: [
                            builder.checkBox(),
                            builder.textBox()
                        ]
                    },
                    {
                        options: {},
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
            }

        ]
    }
    var layout = new cLayout(controlDef);
    layout.appendTo(container);

*/
class cLayoutBase {
    //Children: any[] = [] //need to save children ? consumes memory
    constructor(controlDef = {}, partentTag = "div") {
        this.Options = {};
        this.ControlDef = {};
        this.ControlDef = controlDef;
        if (this.ControlDef.options)
            this.Options = this.ControlDef.options;
        this.Element = document.createElement(partentTag);
        this.ParseOptions();
        this.Build();
    }
    Build() {
        return this;
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
class cColumn extends cLayoutBase {
    constructor(controlDef, index, parent) {
        super(controlDef);
        cUtils.addClass(this.Element, 'c-column');
    }
    Build() {
        super.Build();
        if (this.ControlDef.__ClassName === "cBaseControl") {
            cUtils.appendTo(this.Element, this.ControlDef.Element);
        }
        else {
            if (this.ControlDef.control) {
                let ctrl = this.ControlDef.control;
                cUtils.appendTo(this.Element, ctrl.Element);
            }
            if (this.ControlDef.controls) {
                let ctrls = this.ControlDef.controls;
                if (cUtils.IsArray(ctrls)) {
                    for (var i = 0; i < ctrls.length; i++) {
                        let ctrl = ctrls[i];
                        //this.Children.push(ctrl);
                        cUtils.appendTo(this.Element, ctrl.Element);
                    }
                }
                else {
                    cUtils.appendTo(this.Element, ctrls.Element);
                }
            }
        }
        return this;
    }
    ParseOptions() {
        return this;
    }
}
class cRow extends cLayoutBase {
    constructor(controlDef, index, parent) {
        super(controlDef);
        cUtils.addClass(this.Element, 'c-row');
    }
    Build() {
        super.Build();
        if (this.ControlDef.columns) {
            let cols = this.ControlDef.columns;
            for (var i = 0; i < cols.length; i++) {
                let col = cols[i];
                let colObject = new cColumn(col, i, this);
                //this.Children.push(colObject);
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
    constructor(controlDef) {
        super(controlDef);
        cUtils.addClass(this.Element, 'c-layout');
    }
    Build() {
        super.Build();
        if (this.ControlDef.rows) {
            let rows = this.ControlDef.rows;
            for (var i = 0; i < rows.length; i++) {
                let row = rows[i];
                let rowObject = new cRow(row, i, this);
                //this.Children.push(rowObject);
                cUtils.appendTo(this.Element, rowObject.Element);
            }
        }
        return this;
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
//# sourceMappingURL=cLayout-2.0.js.map