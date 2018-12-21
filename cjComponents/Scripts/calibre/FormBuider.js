/*
Calibre FormBuilder script
2018, Calibre Technologies
Author: Tejasvi Hegde
License: Attributed usage. This comment block cannot be removed

Version 1.5
Last updated: 09-Apr-2018

Comments and Parameter Options:
type: table/bootstrap/grid
ui: bootstrap,bootstrap-material,table Used for Grid Layout


todo: 
Change options objects format and also option to attach data with options list
*/
"use strict";

function FormBuilder(formDef) {
    this.FormDef = formDef;
    this.Opts = this.FormDef.options || {};
    this.Values = this.FormDef.values || {};
    this.Schema = this.FormDef.schema || {};
    this.Layout = this.FormDef.layout || {};
    this.PropertyMap = {}; //Used if properties are to be mapped with some other attribs. like Validation mapping

    /*
    https://johnnycode.com/2014/03/27/using-jquery-validate-plugin-html5-data-attribute-rules/
    data-rule-minlength="2"
    data-rule-maxlength="4"
    data-msg-minlength="At least two chars"
    data-msg-maxlength="At most fours chars"
    */
    this.EndsWith = function (text, word) {
        var diff = text.length - word.length;
        if (diff < 0)
            return false;
        return (text.lastIndexOf(word) === diff);
    }
    this.extend = function (obj, src) {
        obj = obj || {};
        src = src || {};
        Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
        
        return obj;
    },
    this.wordToWords = function (text) {
        var pos = text.lastIndexOf('Id');
        if (pos == text.length - 2)
            text = text.substring(0, pos);
        var result = text.replace(/([A-Z])/g, " $1");//([a-z])([A-Z])
        return result.charAt(0).toUpperCase() + result.slice(1);
    };
    this.ValidationPropertyMap = { message: 'data-msg' };
    this.IsControlType = function (obj) {
        return obj.type === 'button' || obj.type === 'input' || obj.type === 'select'/* || (obj.config !== undefined && (obj.config.directControl != undefined && obj.config.directControl))*/;
    },
    this.GetVueProps = function (obj, props, vue) {
        var retVal = {};
        //set name and id for vie
        if (props['name'] !== undefined) {
            retVal['v-bind:name'] = "'" + props['name'] + "'";
        }
        if (props['id'] !== undefined) {
            retVal['v-bind:id'] = "'" + props['id'] + "'";
        }

        return retVal;
    },
    this.GetHtmlForProps = function (props,obj) {
        var s = "";

        if (props['class'] === undefined)
            props['class'] = '';

        var isControl = this.IsControlType(obj);
        if (!isControl) {


            var span = (obj.span === undefined) ? null : obj.span;
            var offset = (obj.offset === undefined) ? null : obj.offset;
            //offset
            if (offset) {
                if (typeof offset === 'object') {
                    Object.getOwnPropertyNames(offset).forEach(
                        function (val, idx, array) {
                            props['class'] += ' col-' + val + '-offset-' + offset[val];
                        });
                }
                else {
                    props['class'] += ' col-md-offset-' + offset;

                }
            }
            //span
            if (span) {
                if (typeof span === 'object') {
                    Object.getOwnPropertyNames(span).forEach(
                        function (val, idx, array) {
                            props['class'] += ' col-' + val + '-' + span[val];
                        });
                }
                else {
                    props['class'] += ' col-md-' + span;
                }
            }
        }
        if (props['class'] === '')
            delete props['class'];

        
        //Vue
        if (this.Opts.vue || obj.vue) {
            var vue = this.extend(this.Opts.vue, obj.vue);
            var vueProps = this.GetVueProps(obj, props, vue);
            Object.getOwnPropertyNames(vueProps).forEach(
                function (val, idx, array) {
                    s += val + '="' + (typeof vueProps[val] === 'string' ? vueProps[val].replace("\"", "'") : vueProps[val]) + '" ';
                }
            );
        }
        //
        
        var inlineProps = props;//this.extend(props, obj.props);
        //
        Object.getOwnPropertyNames(inlineProps).forEach(
            function (val, idx, array) {
                
                s += val + '="' + (typeof inlineProps[val] === 'string' ? inlineProps[val].replace("\"", "'") : inlineProps[val]) + '" ';
            }
        );

        //if (obj !== undefined) {
            if ((obj.customAttribs !== undefined) && (typeof obj.customAttribs === 'string')){
                s += ' ' + obj.customAttribs;
            }

        //}
        return s;
    };
    this.PrepareProperties = function (objName, obj, context, propertiesToIgnore) {
        var props = {};
        props['name'] = obj.name || objName;
        props['id'] = obj.id || objName;
        /*Attribs*/
        Object.getOwnPropertyNames(obj).forEach(
            function (val, idx, array) {
                if (propertiesToIgnore.indexOf(val) >= 0)
                    return;
                if ((typeof obj[val] === 'string') || (typeof obj[val] === 'boolean') || (typeof obj[val] === 'number')) {
                    var name = context.PropertyMap[val] || val;
                    props[name] = obj[name];
                }
            }, context
        );

        /*Validation*/
        var validation = obj['validation'];
        if (validation) {
            props['required'] = 'required';
            Object.getOwnPropertyNames(context.ValidationPropertyMap).forEach(
                function (val, idx, array) {
                    if (propertiesToIgnore.indexOf('validation.' + val) >= 0)
                        return;
                    var name = context.ValidationPropertyMap[val];
                    props[name] = validation[val];

                }, context
            );
        }
        if (props['class'] === undefined) {
            props['class'] = '';
        }
        if (obj.maxlength !== undefined) {
            props['data-msg-maxlength'] = 'Maximum allowed is ' + obj.maxlength + ' characters/digits';
            props['data-rule-maxlength'] = obj.maxlength;
        }
        if (obj.minlength !== undefined) {
            props['data-msg-minlength'] = 'Minimum required is ' + obj.minlength + ' characters/digits';
            props['data-rule-minlength'] = obj.minlength;
        }

        /*BS*/
        if (context.Opts.bootstrapClasses === undefined) {
            context.Opts.bootstrapClasses = true;
        }
        if (context.Opts.isHandleBarTemplate === undefined) {
            context.Opts.isHandleBarTemplate = false;
        }
        
        if (context.Opts.bootstrapClasses) {
            if (context.Opts.showInputGroupAddOn === undefined) {
                context.Opts.showInputGroupAddOn = true;
            }
        }
        if (context.Opts.defaultRequiredIndicator === undefined) {
            context.Opts.defaultRequiredIndicator = false;
        }
        if (!context.Opts.defaultRequiredIndicator) {
            props['data-no-indicator'] = '';
        }
        //
        if (props['readonly'] !== undefined && props['readonly'] === false)
        {
            delete props['readonly'];
        }
        if (props['disabled'] !== undefined && props['disabled'] === false) {
            delete props['disabled'];
        }
        obj.__props = props;
        return props;
    };
    this.PrepareLabels = function (val, obj) {
        if (obj.label) {
            if (typeof obj.label === 'object') {
                if (obj.label.title === undefined) {
                    obj.label.title = this.wordToWords(val);
                }
                if (!obj.label.help) {

                    obj.label.help = (obj.type === "select" ? 'Select ' : 'Enter ') + obj.label.title;
                }
            }
            else {
                obj.label = {};
                obj.label.title = obj.title;
                obj.label.help = (obj.type === "select" ? 'Select ' : 'Enter ') + obj.label.title;
            }
        }
        else if (obj.title) {
            obj.label = {};
            obj.label.title = obj.title;
            obj.label.help = (obj.type === "select" ? 'Select ' : 'Enter ') + obj.label.title;
        }
        else {
            obj.label = {};
            obj.label.title = this.wordToWords(val);
            obj.label.help = (obj.type === "select" ? 'Select ' : 'Enter ') + obj.label.title;
        }

        if (obj.help) {
            if (obj.label) {
                obj.label.help = obj.help;
            }
        }

        if (obj.type === "select") {
            if (!obj.EmptyOption) {
                if (obj.label.title)
                    obj.EmptyOption = '-- Select ' + obj.label.title + ' --';
            }
        }
        if (obj.required) {
            if (obj.validation) {
                if (!obj.validation.message) {
                    obj.validation.message = 'Valid ' + obj.label.title + ' is required';
                }
            }
            else {
                obj.validation = {};
                obj.validation.message = 'Valid ' + obj.label.title + ' is required';
            }
        }
    };
    this.BuildControls = function () {
        var schema = this.FormDef.schema;
        Object.getOwnPropertyNames(schema).forEach(
            function (val, idx, array) {
                
                if (val.substring(0, 2) === '__') {
                    return;
                }
                    

                var obj = schema[val];
                if (obj.type === undefined) {

                    if (this.EndsWith(val, 'Id') && ((obj.options !== undefined) || (obj.url !== undefined))) {
                        obj.type = 'select';
                    }
                    else if (this.EndsWith(val, 'Address')) {
                        obj.type = 'textarea';
                    }
                    else {
                        obj.type = 'text';
                    }
                }
                this.PrepareLabels(val, obj);
                /*
                var type = obj.type || 'text';
                var handler = this.TypeHandlers[type];
                var html = handler(val, obj, this);
                */
                var html = this.getHtmlForControl(val, obj);
                obj.__html = html;
            }, this
        );
        return this;
    };
    this.getHtmlForControl = function (objName, obj) {
        
        var type = obj.type;
                var handler = this.TypeHandlers[type];
                var html = handler ? handler(objName, obj, this) : '';
                return html;
    };
    this.BuildHtmlWithLayout = function (ctlNames) {
        var html = "";

        if (this.FormDef.layout === undefined) {
            this.FormDef.layout = this.GetBSMLayoutFromSchema(this.FormDef.schema);
        }
        var layout = this.FormDef.layout;
        
        if (layout) {
            var layoutHandler = this.LayoutHandlers[layout.type];
            if (layoutHandler) {
                html = layoutHandler(layout, this.FormDef.schema, this, ctlNames);
            }
        }
        else {
            Object.getOwnPropertyNames(schema).forEach(
                function (val, idx, array) {
                    var obj = schema[val];
                    html += obj.__html;
                }, this
            );
        }
        return html;
    };

    this.ProcessTemplate = function (html) {
        var context = this;
        var nlb = html.replace(/(\r\n|\n|\r)/gm, "");
        return nlb.replace(/<FB>(.*?)<\/FB>/gi, function(a, b){
            return context.GetControlHtml(b.trim());
        });
    };
    this.ProcessTemplateElement = function (name) {
        var elem = document.getElementById(name);
        elem.innerHTML = this.ProcessTemplate(elem.innerHTML);
    };

    this.parseObjectString = function (val){
        try {
            json = eval("{" + val + "}");
        } catch (exception) {
            //It's advisable to always catch an exception since eval() is a javascript executor...
            json = null;
        }
    }
    this.GetControlHtml = function (name, props) {
        var schema = this.FormDef.schema;
        var layout = this.FormDef.layout;
        var context = this;
        if (typeof name === 'object') {
            return context.decodeBootstrapMaterialGridDecode(name, layout, schema, context);
        }
        var regex = /#{(.*?)}#/g;

        if (name.match(regex)) {
            return name.replace(regex, function (a, b) {
                var objStr = "({" + b + "})";
                try {
                    var block =  eval(objStr);
                    return context.decodeBootstrapMaterialGridDecode(block, layout, schema, context);
                } catch (exception) {
                    
                }
            });
            
        }
        else {
            var obj = schema[name];
            if (obj)
            return obj.__html;
        }
        
    };
    this.GetLayoutHtml = function () {
        return this.BuildHtmlWithLayout()
    };
    //Write Individual Control
    this.WriteControl = function (name, props) {
        if (typeof name === 'string') {
            var schema = this.FormDef.schema;
            var orgObj = schema[name];
            var obj = {};
            for (var x in orgObj) {
                if (!(x.substring(0, 2) === '__'))
                    obj[x] = orgObj[x];
            }
            if (props) {
                for (var x in props) {
                    obj[x] = props[x];
                }
            }
            var html = this.getHtmlForControl(name, obj);
            document.write(html);
        }
        else if (typeof name === 'object') {
            document.write(this.GetControlHtml(name, props));  

        }
        //
    };
    this.WriteToContainer = function (containerName, name) {
        var schema = this.FormDef.schema;
        var obj = schema[name];
        var container = document.getElementById(containerName);
        container.innerHTML = obj.__html;
    };
    //Write Controls set based on layout
    this.WriteAll = function () {
        document.write(this.BuildHtmlWithLayout());
    };
    this.WriteControls = function (ctlNames) {
        document.write(this.BuildHtmlWithLayout(ctlNames));
    };
    this.WriteControlsToContainer = function (containerName,ctlNames) {
        var container = document.getElementById(containerName);
        container.innerHTML = this.BuildHtmlWithLayout(ctlNames);
    };
    this.WriteAllToContainer = function (containerName) {
        var container = document.getElementById(containerName);
        container.innerHTML = this.BuildHtmlWithLayout();
    };
    /*Control Handlers
    Should return prepared html
    */
    this.HiddenControl = function (objName, obj, context) {
        var props = context.PrepareProperties(objName, obj, context, ['data-no-indicator']);
        var value = props['value'] === undefined ? '' : props['value'];
        if (context.FormDef.values) {
            var val = context.FormDef.values[objName];
            if ((val !== undefined) && (val !== null)) {
                value = val;
            }
        }
        delete props['data-no-indicator'];
        props['value'] = value;
        var html = '<input ' + context.GetHtmlForProps(props, obj) + '/>';
        return html;
    };

    this.StaticControl = function (name, obj, context) {
        /*
         * Static text/control
         */
        var propertiesToIgnore = ['type', 'controlType', 'content', 'data-no-indicator', 'name', 'schemaId','value','text'];
        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);
        //var value = props['value'] === undefined ? (obj.content || '') : props['value'];
        var valName = obj.schemaId ? obj.schemaId : name;
        var value = obj.text || obj.value || obj.content || '';
        

        if (context.FormDef.values) {
            var val = context.FormDef.values[valName];
            if ((val !== undefined) && (val !== null)) {
                value = val;
            }
        }
        delete props['name'];
        delete props['data-no-indicator'];
        var tag = obj.controlType || 'span';
        var html = value;
        if (tag !== '') {
            html = '<' + tag + ' ' + context.GetHtmlForProps(props, obj) + '>'+value+'</'+tag+'>';
        }
        return html;
    };
    this.RawHTMLControl = function (name, obj, context) {
        return (obj.content || obj.text || '');
        
    };
    this.LabelControl = function (name, obj, context) {
        /*
         * Static text/control
         */
        var propertiesToIgnore = ['type', 'controlType', 'content', 'data-no-indicator', 'name', 'text','schemaId'];
        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);

        var objForLbl;
        if (name.substring(0, 2) !== '__') {
            objForLbl = obj.schemaId ? context.Schema[obj.schemaId] : context.Schema[name];
        }
        

        var value = objForLbl ? (objForLbl.label ? objForLbl.label.title : ''): (obj.text || obj.content || '');
        /*if (context.FormDef.values) {
            var val = context.FormDef.values[name];
            if ((val !== undefined) && (val !== null)) {
                value = val;
            }
        }*/
        if (!obj.id) {
            delete props['id'];
        }
        
        delete props['name'];
        delete props['data-no-indicator'];
        var tag = 'label';
        var html = value;
        html = '<' + tag + ' ' + context.GetHtmlForProps(props, obj) + '>' + value + '</' + tag + '>';
        return html;
    };
    this.LabelForControl = function (name, obj, context) {
        /*
         * Static text/control
         */
        var propertiesToIgnore = ['type', 'controlType', 'content', 'data-no-indicator', 'name', 'text'];
        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);
        var value = obj.text ? obj.text : (obj.content || '');

        var objForLbl = name === null ? null : context.Schema[name];

        if (objForLbl) {

                var lblText = '';
                var helpText = '';
                if (objForLbl.label) {
                    if (typeof objForLbl.label === 'object') {
                        if (objForLbl.label.title) {
                            lblText = objForLbl.label.title;
                        }
                        if (objForLbl.label.help) {
                            helpText = objForLbl.label.help;
                        }
                        else if (lblText && lblText != ''){
                            helpText = 'Enter ' + lblText;
                        }
                    }
                    else {
                        lblText = objForLbl.label;
                    }
                    
                }
                if (objForLbl.help) {
                    helpText = objForLbl.help;
                }
                if (lblText != '') {
                    value = lblText + (objForLbl.required ? '&nbsp;<small style="color:red;">*</small>' : '');
                }
            
        }

        if (!obj.id) {
            delete props['id'];
        }

        delete props['name'];
        delete props['data-no-indicator'];
        var tag = 'label';
        var html = value;
        html = '<' + tag + ' ' + context.GetHtmlForProps(props, obj) + '>' + value + '</' + tag + '>';
        return html;
    };
    //LabelForControl
    this.ButtonControl = function (name, obj, context) {
        /*
         * Button control
         */
        var propertiesToIgnore = ['type', 'controlType', 'content', 'name', 'submit', 'text','data-no-indicator'];
        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);
        var value = obj.text ? obj.text : (obj.content || '');
        if (context.FormDef.values) {
            var val = context.FormDef.values[name];
            if ((val !== undefined) && (val !== null)) {
                value = val;
            }
        }

        delete props['data-no-indicator'];
        if (!obj.name) {
            delete props['name'];
        }
        if (!obj.id) {
            delete props['id'];
        }

        /*        
        if (name) {
            props['name'] = name;
        }
        */
        var tag = 'button';
        var submit = obj.submit || false;
        var html = value;
        
        html = '<button type="' + (submit ? 'submit' : 'button')+'" '+ context.GetHtmlForProps(props, obj) + '>' + value + '</button>';
        
        return html;
    };
    this.TextControl = function (name, obj, context) {
        /*Define your control Specific properties, will be ignored by PrepareProperties method*/
        var propertiesToIgnore = ['dataType', 'selectOnFocus', 'icon', 'showInputGroupAddOn','subType'];

        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);

        if (context.FormDef.values) {
            var value = context.FormDef.values[name];
            if ((value !== undefined) && (value !== null)) {
                props['value'] = value;
            }
        }
        if (obj.required) {
            var layout = context.FormDef.layout;
            if (layout && layout.type === 'bootstrap') {
                props['data-no-indicator'] = 'true';
            }
        }
        if (context.Opts.bootstrapClasses) {
            if (props['class'].indexOf('form-control') < 0)
                props['class'] += ' form-control';
        }

        props['type'] = obj.subType ? obj.subType : 'text';
        var dataType = obj.dataType;
        if (dataType === undefined) {
            if (context.EndsWith(name, 'Date') || context.EndsWith(name, 'On')) {
                dataType = 'date';
            }
            if ((context.EndsWith(name, 'Amount')) || (context.EndsWith(name, 'Amt')) || (context.EndsWith(name, 'Rate')) || (context.EndsWith(name, 'Perc')) ) {
                dataType = 'decimal';
            }
            if (context.EndsWith(name, 'Time')) {
                dataType = 'clock';
            }
            if ((context.EndsWith(name, 'Quantity')) || (context.EndsWith(name, 'Qty'))) {
                dataType = 'integer';
            }
            //
        }
        var dataClass = '';
        var iconCls = obj.icon || '';
        switch (dataType) {
            case 'integer':
            case 'int':
                dataClass = 'integer';
                iconCls = obj.icon || 'glyphicon-pencil';


                if (obj['validation'] !== undefined)
                    props['required'] = 'required';
                props['data-msg-digits'] = 'Please enter non decimal number';
                props['data-rule-digits'] = 'true';

                break;
            case 'decimal':
                dataClass = 'decimal';
                iconCls = obj.icon || 'glyphicon-pencil';

                if (obj['validation'] !== undefined)
                    props['required'] = 'required';
                props['data-msg-number'] = 'Please enter non decimal number';
                props['data-rule-number'] = 'true';
                break;
            case 'date':
                dataClass = 'datepicker';
                iconCls = obj.icon || 'glyphicon-calendar';
                break;
            case 'clock':
                dataClass = 'clockpicker';
                iconCls = obj.icon || 'glyphicon-time';
                break;
        }
        if (obj.selectOnFocus === undefined || obj.selectOnFocus !== false) {
            dataClass += ' select-on-focus';
        }
        props['class'] += ' ' + dataClass;

        var html = '<input ' + context.GetHtmlForProps(props, obj) + ' />';

        //if (((obj.showInputGroupAddOn === undefined) && context.Opts.showInputGroupAddOn) || obj.showInputGroupAddOn) {
        if (obj.showInputGroupAddOn) {

            html = '<div class="input-group"><span class="input-group-addon"><i class="add-on-icon glyphicon ' + iconCls + '"></i></span>' + html + '</div>';
        }

        return html;
    };
    this.TextAreaControl = function (name, obj, context) {
        /*Define your control Specific properties, will be ignored by PrepareProperties method*/
        var propertiesToIgnore = ['selectOnFocus','value'];

        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);
        var value = obj.value === undefined ? '' : obj.value;
        if (context.FormDef.values) {
            var val = context.FormDef.values[name];
            if ((val !== undefined) && (val !== null)) {
                value = val;
            }
        }
        if (obj.required) {
            var layout = context.FormDef.layout;
            if (layout && layout.type === 'bootstrap') {
                props['data-no-indicator'] = 'true';
            }
        }
        if (context.Opts.bootstrapClasses) {
            if (props['class'].indexOf('form-control') < 0)
                props['class'] += ' form-control';
        }
        var dataClass = '';
        if (obj.selectOnFocus !== undefined && obj.selectOnFocus !== false) {
            dataClass += ' select-on-focus';
            props['class'] = (props['class'] || '') + ' ' + dataClass;
        }

        if (!props['rows']) {
            props['rows'] = 4;
        }
        
        var html = '<textarea ' + context.GetHtmlForProps(props, obj) + '>' + value + '</textarea>';
        return html;
    };
    
    this.BuildRadioOrCheckBoxControl = function (name, obj, context, inputType) {

        if (obj.value === undefined) {
            obj.value = '1';
        }
        if (obj.options === undefined || Object.getOwnPropertyNames(obj.options).length === 0) {
            obj.options = {};
            obj.options[obj.value] = '';
        }
        /*
        if ((obj.options === undefined || Object.getOwnPropertyNames(obj.options).length === 0) && (obj.value === undefined))
            obj.value = '1';
            //return '';
            */
        if ((obj.options === undefined) && (obj.value !== undefined)) {
            obj.options = {};
            obj.options[obj.value] = (obj.label ? (obj.label.title ? obj.label.title : ''): '');
            //
        }
        var propertiesToIgnore = ['inline', 'options','value'];
        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);
        if (obj.required) {
            var layout = context.FormDef.layout;
            props['data-no-indicator'] = 'true';
        }
        props['type'] = inputType;
        var ctlId = props['id'];
        var selValue = null;

        if (context.FormDef.values) {

            selValue = context.FormDef.values[name];
        }
        
        
        var html = '';
        var isInLine = (obj.inline === undefined || obj.inline !== false);
        
        //
            Object.getOwnPropertyNames(obj.options).forEach(
                function (key, idx, array) {
                    var value = obj.options[key];
                    var id = ctlId + (Object.getOwnPropertyNames(obj.options).length > 1 ? '_' + idx : '');
                    var vbind = '';
                    if (obj["v-bind:id"]) {
                        if (Object.getOwnPropertyNames(obj.options).length > 1) {
                            vbind = obj["v-bind:id"] + "+'_" + idx + "'";
                            props["v-bind:id"] = vbind;
                        }
                        
                    }
                    var ss = '';
                    if (context.Opts.isHandleBarTemplate) {
                        ss = ' {{{setChecked ' + key + ' ' + name + '}}} '
                    }
                    if (key == selValue) {
                        props['checked'] = 'checked';
                    }
                    else {
                        if (selValue !== undefined)
                            delete props['checked'];
                    }
                    if (isInLine) {
                        if (obj.inline !== undefined) {
                            if (vbind == '') {
                                html += '<div class="' + inputType + ' ' + inputType + '-inline" for="' + id + '">';
                                html += '<label for="' + id + '">';//
                            } else {
                                html += '<div class="' + inputType + ' ' + inputType + '-inline" v-bind:for="' + vbind + '">';
                                html += '<label v-bind:for="' + vbind + '">';//
                            }
                            
                            props['value'] = key;
                            props['id'] = id;

                            html += '<input ' + context.GetHtmlForProps(props, obj) + ' ' + ss + ' />';
                            html += value;
                            html += '</label>';
                            html += '</div>';
                        }
                        else {
                            html += '<div class="' + inputType + '">';
                            if (vbind == '') {
                                html += '<label for="' + id + '">';//
                            } else {
                                html += '<label v-bind:for="' + vbind + '">';//
                            }
                            props['value'] = key;
                            props['id'] = id;

                            html += '<input ' + context.GetHtmlForProps(props, obj) + ' ' + ss + ' />';
                            html += value;
                            html += '</label>';
                            html += '</div>';
                        }
                        
                    }
                    else {
                        html += '<div class="' + inputType + '">';
                        if (vbind == '') {
                            html += '<label for="' + id + '">';
                        } else {
                            html += '<label v-bind:for="' + vbind + '">';//
                        }
                        
                        props['value'] = key;
                        props['id'] = id;
                        html += '<input ' + context.GetHtmlForProps(props, obj) + ' ' + ss + ' />';
                        html += value;
                        html += '</label>';
                        html += '</div>';
                    }
                }, context
            );
            //
        props['id'] = ctlId;
        return html;
    };
    this.RadioControl = function (name, obj, context) {

        return context.BuildRadioOrCheckBoxControl(name, obj, context, 'radio');
    };
    this.CheckboxControl = function (name, obj, context) {

        return context.BuildRadioOrCheckBoxControl(name, obj, context, 'checkbox');
    };
    this.SelectControl = function (name, obj, context) {

        var propertiesToIgnore = ['type', 'url', 'EmptyOption', 'value','OptionsHtml'];
        var props = context.PrepareProperties(name, obj, context, propertiesToIgnore);
        if (obj.required) {
            var layout = context.FormDef.layout;
            props['data-no-indicator'] = 'true';
        }
        if (context.Opts.bootstrapClasses) {
            if (props['class'].indexOf('form-control') < 0)
                props['class'] += ' form-control';
        }
        //props['type'] = 'select';
        var ctlId = props['id'];
        var selValue = obj.value === undefined ? null : obj.value;
        if (context.FormDef.values) {
            if (context.FormDef.values[name] !== undefined)
                selValue = context.FormDef.values[name];
        }

        var url = obj.url;
        var addnlCls = '';
        if (url) {
            addnlCls += 'selectpicker-ajax  selectpicker-live';
            props['data-abs-ajax-url'] = url;
        }
        else {
            if (props['class'].indexOf('form-control') < 0)
                addnlCls += 'form-control ';

        }
        props['class'] = (props['class'] || '') + ' ' + addnlCls;

        var optsHtml = '';

        if (obj.EmptyOption) {

            //optsHtml += '<option value="">' + obj.EmptyOption + '</option>';
            optsHtml += '<option value="">' + obj.EmptyOption + '</option>';
        }
        if (obj.OptionsHtml) {

            optsHtml += obj.OptionsHtml;
        }
        if (obj.options) {
            //Object.getOwnPropertyNames(obj.options)
            if (typeof obj.options === 'object') {
                Object.keys(obj.options).forEach(
                    function (key, idx, array) {
                        var text = obj.options[key];
                        var selected = (key == selValue) ? 'selected' : '';
                        optsHtml += '<option value="' + key + '" ' + selected + '>' + text + '</option>';
                    }, context
                );
            }
            /*else {
                props['options'] = obj.options;
            }*/
        }
        var html = '<select ' + context.GetHtmlForProps(props, obj) + ' >' + optsHtml + '</select>';
        return html;
    };
    /*Layout handlers*/
    this.TableLayout = function (layout, schema, context) {
        var hiddenHtml = '';
        var html = '<table class="' + (layout.class || '') + '" style="' + (layout.style || '') + '" >';
        var rowNo = 1;
        //
        Object.getOwnPropertyNames(schema).forEach(
            function (val, idx, array) {
                var obj = schema[val];
                if (obj.type === 'hidden') {
                    hiddenHtml += obj.__html;
                    return;
                }
                var s = '<td' + (rowNo === 1 ? ' style="width:' + (layout.titleColWidth || '50%') + '"' : '') + ' align="right">';
                if (!obj.noLabel) {
                    var labelObj = obj.label;
                    var label = val;
                    if (labelObj && labelObj.title) {
                        label = labelObj.title;
                    }

                    s += '<span>' + label + '</span>';
                }
                if (obj.required) {
                    s += '<span class="required-indicator"></span>';
                }
                s += '</td>';
                s += '<td>' + obj.__html + '</td>';
                html += '<tr>' + s + '</tr>';
                rowNo++;
            }, this
        );
        html += '</table>';
        return hiddenHtml + html;
    };
    this.BootstrapLayout = function (layout, schema, context) {

        var html = '';
        Object.getOwnPropertyNames(schema).forEach(
            function (val, idx, array) {
                var obj = schema[val];
                if (obj.type === 'hidden') {
                    html += obj.__html;
                    return;
                }
                var id = obj.__props['id'];
                var s = '<div class="form-group ' + (obj.required ? 'required' : '') + '">';
                s += '<div class="col-md-4 text-right">';
                if (!obj.noLabel) {
                    var label = obj.label;
                    var title = val;
                    var help = null;
                    if (label && label.title) {
                        title = label.title;
                    }
                    if (label && label.help) {
                        help = label.help;
                    } else if (title && title != '') {
                        help = 'Enter ' + title;
                    }
                    s += '<label class="control-label color grayed" for="' + id + '">' + title + '</label>';
                } else if (obj.required) {
                    s += '<label class="control-label color grayed" for="' + id + '"></label>';
                }
                s += '</div>';
                s += '<div class="col-md-4">';
                s += obj.__html;
                if (help) {
                    s += '<span class="help-block">' + help + '</span>';
                }
                s += '</div></div>';
                html += s;
            }, this
        );

        return html;
    };
    this.prepareGrid = function (layout, schema, context) {
        var grid = layout.grid;
        var len = grid.length;
        for (var r = 0; r < len; r++) {
            var rowObj = grid[r];
            var cells = rowObj.cells;
            var numCols = cells.length;
            for (var c = 0; c < numCols; c++) {
                var cellDef = cells[c];
                var obj = schema[cellDef.id];
                if (obj === undefined) {
                    grid[r].cells[c].__html = '';
                    continue;
                }
                if (cellDef.type == 'control') {
                    grid[r].cells[c].__html = obj.__html;
                } else {
                    //type - label

                    if (!obj.noLabel) {
                        var label = obj.label;
                        var objId = obj.__props['id'];
                        var title = objId;
                        var help = null;
                        if (label && label.title) {
                            title = label.title;
                        }
                        if (label && label.help) {
                            help = label.help;
                        } else if (label && label != '') {
                            help = 'Enter ' + label;
                        }
                        grid[r].cells[c].__html = title;
                    } else if (obj.required) {
                        grid[r].cells[c].__html = '';
                    }
                }
            }
        }
    };
    this.GridLayout = function (layout, schema, context) {

        /*Properties:
            id - name of variable
            type - label/control
            class - classes
            span - number/obj { md: 2, lg: 1 } etc.
            offset - number/obj { md: 2, lg: 1 } etc.
        */
        var html = '';
       /* if (layout.ui === 'bootstrap-material') {
            html += context.buildBootstrapMaterialGridLayout(layout, schema, context);
            return html;
        }

            */

        context.prepareGrid(layout, schema, context);

        
        //hidden types first
        
        Object.getOwnPropertyNames(schema).forEach(
            function (val, idx, array) {
                var obj = schema[val];
                if (obj.type === 'hidden') {
                    html += obj.__html;
                }
            });

        if (layout.ui === 'bootstrap')
            html += context.buildBootstrapGridLayout(layout, schema, context);
        else 
            html += context.buildTableGridLayout(layout, schema, context);

        return html;
    };
    this.buildBootstrapGridLayout = function (layout, schema, context) {

        var html = '';
        var grid = layout.grid;
        var len = grid.length;
        for (var r = 0; r < len; r++) {
            var row = grid[r];
            var cells = row.cells;
            var numCols = cells.length;
            var rowHtml = '';
            for (var c = 0; c < numCols; c++) {
                var cellDef = cells[c];
                var obj = schema[cellDef.id];

                var cellClass = (cellDef.class === undefined) ? '' : cellDef.class;
                //offset
                if (typeof cellDef.offset === 'object') {
                    Object.getOwnPropertyNames(cellDef.offset).forEach(
                        function (val, idx, array) {
                            var obj = schema[val];
                            cellClass += ' col-' + val + '-offset-' + cellDef.offset[val];
                        });
                }
                else {
                    if (cellDef.offset !== undefined) {
                        cellClass += ' col-md-offset-' + cellDef.offset;
                    }
                    
                }
                //span
                if (typeof cellDef.span === 'object') {
                    Object.getOwnPropertyNames(cellDef.span).forEach(
                        function (val, idx, array) {
                            var obj = schema[val];
                            cellClass += ' col-' + val + '-' + cellDef.span[val];
                        });
                }
                else {
                    cellClass += ' col-md-' + (cellDef.span !== undefined ? cellDef.span : '1');
                   
                }

                

                rowHtml += '<div class="' + cellClass.trim() + '"';
                if (cellDef.style !== undefined)
                    rowHtml += ' style="' + cellDef.style + '"';
                rowHtml += '>';
                if (cellDef.type == 'control') {
                    rowHtml += cellDef.__html;
                } else {
                    //type - label
                    if (obj != undefined && obj != null) {
                        var objId = obj.__props['id'];
                        if (!obj.noLabel) {
                            rowHtml += '<label class="control-label" for="' + objId + '">' + cellDef.__html + (obj.required ? '&nbsp;<small style="color:red;">*</small>' : '')+ '</label>';
                        } 
                    }
                    
                }

                rowHtml += '</div>';
            }
            var rowClass = 'form-group';
            var rowStyle;
            rowClass += row.class === undefined ? '' : ' '+row.class;
            if (row.style !== undefined)
                rowStyle = ' style="' + row.style + '"';

            html += '<div class="' + rowClass + '" ' + (rowStyle !== undefined ? ' style="' + rowStyle+'"' : '') + '>' + rowHtml + '</div>';
        }
        return html;
    };

    /*********************************************************
    Bootstrap Grid Layout
    *********************************************************/
    this.decodeBootstrapMaterialGridDecode = function (block, layout, schema, context, ctlNames) {
        var html = '';
        /*Takes div as enclosing element when type is not specified*/
        /*
        { class: 'form-group label-floating', schemaId: 'name' }, 
        { class: 'category form-category', text: '<small>*</small> Required fields' },
        {
            class: 'form-footer text-right',
                items: [
                    { schemaId: 'chkBox', class: 'checkbox pull-left' },
                    { type: 'button',submit : true, class: 'btn btn-rose btn-fill', text: 'Register' }
                ]
        },
        {
            class: 'row',
                items: [
                    { type: 'label', schemaId: 'age', class: 'label-on-left', span: { sm: 2 } },
                    {
                        span: { sm: 10 },
                        items: [
                            {
                                class: 'row',
                                items: [
                                    { span: { sm: 3 }, class: 'form-group label-floating is-empty', schemaId: 'name' },
                                    { span: { sm: 4 }, class: 'form-group label-floating is-empty', schemaId: 'name' },
                                    { span: { sm: 5 }, class: 'form-group label-floating is-empty', schemaId: 'name' },
                                ]
                            }
                        ]
                    }
                ]
        }

        */

        //Get field values with default value
        var type = block.type === undefined ? 'div' : block.type.toLowerCase();
        
        var cellClass = (block.class === undefined) ? null : block.class;
        var cellStyle = (block.style === undefined) ? null : block.style;
        var schemaId = (block.schemaId === undefined) ? null : block.schemaId;

        if ((schemaId !== null) && (ctlNames && ctlNames.indexOf(schemaId) < 0)) {
            return '';//render only supplied fields
        }


        var span = (block.span === undefined) ? null : block.span;
        var offset = (block.offset === undefined) ? null : block.offset;
        var items = (block.items === undefined) ? [] : block.items;
        var text = (block.text === undefined) ? '' : block.text;
        // derive values
        var obj = schemaId === null ? null : schema[schemaId];
        var inlineProps = block.props || (block.type !== 'labelFor' ? (obj ? obj.props : undefined) : null); 

        //derive html
        var attribs = [];
        attribs['class'] = cellClass ? cellClass.trim() : '';
        attribs['style'] = cellStyle  ? cellStyle.trim() : '';
        if (type === 'group') {
            attribs['class'] += ' form-group';
        }
        //offset
        if (offset) {
            if (typeof offset === 'object') {
                Object.getOwnPropertyNames(offset).forEach(
                    function (val, idx, array) {
                        attribs['class'] += ' col-' + val + '-offset-' + offset[val];
                    });
            }
            else {
                attribs['class'] += ' col-md-offset-' + offset;
                
            }
        }
        //span
        if (span) {
            if (typeof span === 'object') {
                Object.getOwnPropertyNames(span).forEach(
                    function (val, idx, array) {
                        attribs['class'] += ' col-' + val + '-' + span[val];
                    });
            }
            else {
                attribs['class'] += ' col-md-' + span;
            }
        }

        var childHtml = '';
        var helpHtml = '';
        var floatingLabel = false;
        if (obj) {
            if (type === 'group') {
                var lblText = '';
                var helpText = '';
                var config = obj.config || {};
                var showHelpText = config.showHelpText === undefined ? true : config.showHelpText;
                
                if (obj.label) {
                    if (typeof obj.label === 'object') {
                        if (obj.label.title) {
                            lblText = obj.label.title;
                        }
                        if (showHelpText && obj.label.help) {
                            helpText = obj.label.help;
                        } else if (showHelpText && lblText && lblText != '') {
                            helpText = 'Enter ' + lblText;
                        }
                    }
                    else {
                        lblText = obj.label;
                    }
                    if (obj.floatingLabel) {
                        floatingLabel = true;
                    }
                }
                if (showHelpText && obj.help) {
                    helpText = obj.help;
                }
                if (floatingLabel) {
                    childHtml += '<label class="control-label">' + lblText + (obj.required && (lblText !== '') ? '&nbsp;<small style="color:red;">*</small>' : '') + '</label>';
                }
                
                if (helpText && helpText != '') {
                    if ((obj.type === 'text') || (obj.type === 'textarea') || (obj.type === 'select')) {
                        helpHtml = '<label class="help-block">' + helpText + '</label>';
                    }
                    
                }
            }
            if (inlineProps) {
                
                var newObj = {};
                for (var x in obj) {
                    if (!(x.substring(0, 2) === '__'))
                        newObj[x] = obj[x];
                }
                if (inlineProps) {
                    for (var x in inlineProps) {
                        newObj[x] = inlineProps[x];
                    }
                }
                //var newObj = context.extend(block, block.props);
                var html2 = this.getHtmlForControl(schemaId, newObj);
                childHtml += html2;
            }
            else {
                childHtml += obj.__html;
            }
            
        }
        
        //get inner block html
        for (var i = 0; i < items.length; i++) {
            childHtml += this.decodeBootstrapMaterialGridDecode(items[i], layout, schema, context, ctlNames);
        }
        childHtml += helpHtml;
        //Generate final html
        Object.keys(attribs).forEach(function (key) { html += (attribs[key].trim() !== '' ? ' ' + key + '="' + attribs[key] + '"' : '').trim(); })

        switch(type)
        {
            case 'div': {
                html = '<div ' + html + '>' + text + childHtml + '</div>';
            }
                break;
            case 'group': {
                html = '<div ' + html + '>' + text + childHtml + '</div>';
            }
                break;
            case 'none': {
                html = childHtml;
            }
                break;
            default: {
                if (type) {
                        
                        var newObj = {};
                        for (var x in block) {
                            if (!(x.substring(0, 2) === '__'))
                                newObj[x] = block[x];
                        }
                        if (inlineProps) {
                            for (var x in inlineProps) {
                                newObj[x] = inlineProps[x];
                            }
                        }
                    //var newObj = context.extend(block, block.props);
                        html = context.getHtmlForControl(schemaId, newObj);
                }
            }
            
        }
        return html;
    }
    this.BootstrapMaterialGridLayout = function (layout, schema, context, ctlNames) {
        /*
        grid: Array of objects expressing the blocks of elements
        Each object can also have Items property
        */
        var html = '';
        var grid = layout.grid;
        var len = grid.length;
        for (var r = 0; r < len; r++) {
            var block = grid[r];
            html += context.decodeBootstrapMaterialGridDecode(block, layout, schema, context, ctlNames);
        }
        return html;
    };
    this.buildTableGridLayout = function (layout, schema, context) {

        //offset is not used, span and rowspan is used
        var html = '<table';
        if (layout.class !== undefined)
            html += ' class="' + layout.class + '"';
        if (layout.style !== undefined)
            html += ' style="' + layout.style+'"';
        html += '>';

        var grid = layout.grid;
        var len = grid.length;
        for (var r = 0; r < len; r++) {
            var row = grid[r];
            var cells = row.cells;
            var numCols = cells.length;

            var rowHtml = '<tr';

            if (row.class !== undefined)
                rowHtml += ' class="' + row.class + '"';
            if (row.style !== undefined)
                rowHtml += ' style="' + row.style + '"';
            rowHtml += '>';

            
            for (var c = 0; c < numCols; c++) {
                var cellDef = cells[c];
                var obj = schema[cellDef.id];

                var cellHtml = '';
                
                //span
                if (cellDef.span !== undefined) {
                    cellHtml += ' colspan="' + cellDef.span + '"';
                }
                if (cellDef.rowspan !== undefined) {
                    cellHtml += ' rowspan="' + cellDef.rowspan + '"';
                }

                if (cellDef.class !== undefined)
                    cellHtml += ' class="' + cellDef.class + '"';
                if (cellDef.style !== undefined)
                    cellHtml += ' style="' + cellDef.style + '"';

               

                if (cellDef.isHeader)
                    cellHtml = '<th ' + cellHtml + '>' + cellDef.__html+'</th>';
                else 
                    cellHtml = '<td ' + cellHtml + '>' + cellDef.__html+'</td>';

                rowHtml += cellHtml;
            }
            html += rowHtml+'</tr>';
        }
        html += '</table>';
        return html;
    };
    this.GetBSMLayoutFromSchema = function(schema, defLblWidth, defInpWidth) {
        var result = { type: "bootstrap-material", grid: [] };
        var defLabelWidth = defLblWidth || 3;
        var defInputWidth = defInpWidth || 7;
        var directControl = false;
        var rNo;
        var item;
        var isNewItem = true;
        var num = 0;
        for (var x in schema) {
            
            var objs = [];
            if (x.substring(0, 2) === '__') {
                if (Array.isArray(schema[x])) {
                    objs = schema[x];
                }
                else {
                    objs.push(schema[x]);
                    
                }
                
            }
            else {
                objs.push(schema[x]);
            }
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];

                //add control
                var config = obj.config || {};
                var directControl = config.directControl != undefined && config.directControl;
                //var item;
                isNewItem = (num == 0) || (config.isNewRow) || (config.r !== undefined && rNo !== config.r) /*|| (item === undefined)*/;
                if (isNewItem) {
                    rNo = config.r;
                    
                }
                if ((item === undefined) || isNewItem) {
                    item = { class: 'row', items: [] };
                }
                if (directControl) {
                    /*if (config.r === undefined) {
                        isNewItem = true;
                        item = obj;
                        item.schemaId = config.schemaId || x;
                    }
                    else {*/
                        var ctl = obj;
                        ctl.schemaId = (obj.schemaId || config.schemaId || x);
                        if (ctl.span === undefined) {
                            ctl.span = { md: (config.w ? config.w : 1) }
                        }
                        if ((ctl.offset === undefined) && (config.o)) {
                            ctl.offset = { md: config.o };
                        }
                        if ((ctl.class === undefined) && (config.class)) {
                            ctl.class = config.class;
                        }
                        item.items.push(ctl);
                    //}

                }
                else {
                    if (!config.noLabel) {
                        var lblCtl = { type: 'labelFor', schemaId: x, class: 'label-on-left', span: { md: (config.lw ? config.lw : (isNewItem ? defLabelWidth : 1)), xs: (config.lw ? config.lw : (isNewItem ? defLabelWidth : 1)), sm: (config.lw ? config.lw : (isNewItem ? defLabelWidth : 1)) } };
                        if (config.lo) {
                            lblCtl.offset = { md: config.lo, xs: config.lo, sm: config.lo };
                        }
                        item.items.push(lblCtl);
                    }

                    var inpCtl = { span: { md: (config.w ? config.w : (isNewItem ? defInputWidth : 3)), sm: (config.w ? config.w : (isNewItem ? defInputWidth : 3)), xs: (config.w ? config.w : (isNewItem ? defInputWidth : 3))}, items: [{ type: 'group', schemaId: x }] };
                    if (config.o) {
                        inpCtl.offset = { md: config.o, sm: config.o, xs: config.o};
                    }
                    
                    item.items.push(inpCtl);
                }


                if (isNewItem) {
                    result.grid.push(item);
                }
            }
            //Add control
            num++;
        }
        //result.grid.push({ offset: { md: 3 }, class: 'category form-category', text: '<small>*</small> Required fields' });
        return result;
    }
    /*This should be after all Handlers definition*/
    this.TypeHandlers = {
        'hidden': this.HiddenControl,
        'text': this.TextControl,
        'radio': this.RadioControl,
        'checkbox': this.CheckboxControl,
        'textarea': this.TextAreaControl,
        'select': this.SelectControl,
        'static': this.StaticControl,
        'button': this.ButtonControl,
        'label': this.LabelControl,
        'labelFor': this.LabelForControl,
        'html': this.RawHTMLControl
    };
    this.LayoutHandlers = {
        'table': this.TableLayout,
        'bootstrap': this.BootstrapLayout,
        'grid': this.GridLayout,
        'bootstrap-material': this.BootstrapMaterialGridLayout,
    };
    this.BuildControls();
    return this;
}