/*
 * cView
 * Calibre Technologies
 * Tejasvi Hegde
 * version 2.0
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
var cView = /** @class */ (function () {
    function cView(containerName, dataSource, config) {
        this.IsHtmlBased = true;
        //, isHtmlBased: boolean = true
        this.Config = config || {};
        this.Container = document.getElementById(containerName);
        this.Adaptor = new cDataAdaptor(dataSource);
        this.IsHtmlBased = this.Config.IsHtmlBased == null ? true : this.Config.IsHtmlBased;
    }
    cView.prototype.prepareViewHtml = function () {
        var html = '';
        //container start
        if (this.OnGetViewStartHtml !== undefined) {
            html += this.OnGetViewStartHtml(this);
        }
        //header
        if (this.OnGetHeaderHtml !== undefined) {
            html += this.OnGetHeaderHtml(this);
        }
        //body
        if (this.OnGetDataViewStartHtml !== undefined) {
            html += this.OnGetDataViewStartHtml(this);
        }
        var data = this.Adaptor.GetData();
        data.forEach(function (row, index) {
            if (this.OnGetRecordHtml !== undefined) {
                html += this.OnGetRecordHtml(this, row, index);
            }
        }, this);
        if (this.OnGetDataViewEndHtml !== undefined) {
            html += this.OnGetDataViewEndHtml(this);
        }
        //footer
        if (this.OnGetFooterHtml !== undefined) {
            html += this.OnGetFooterHtml(this);
        }
        //container end
        if (this.OnGetViewEndHtml !== undefined) {
            html += this.OnGetViewEndHtml(this);
        }
        //set html
        this.Container.innerHTML = html;
        if (this.OnAttachedToDOM !== undefined) {
            this.OnAttachedToDOM(this, this.Container);
        }
    };
    cView.prototype.prepareView = function () {
        this.InitView();
        this.CreateHeader(this.ViewElement);
        var dataContainer = this.CreateDataContainer(this.ViewElement);
        this.ViewElement.appendChild(dataContainer);
        var data = this.Adaptor.GetData();
        data.forEach(function (row, index) {
            this.CreateRecord(dataContainer, row, index);
        }, this);
        this.CreateFooter(this.ViewElement);
        //clear and set content on DOM
        while (this.Container.lastChild) {
            this.Container.removeChild(this.Container.lastChild);
        }
        this.Container.appendChild(this.ViewElement);
    };
    cView.prototype.InitView = function () {
        this.ViewElement = document.createElement('div');
    };
    cView.prototype.CreateHeader = function (container) { };
    cView.prototype.CreateFooter = function (container) { };
    cView.prototype.CreateDataContainer = function (container) {
        return document.createElement('div');
    };
    cView.prototype.CreateRecord = function (container, row, index) { };
    //methods
    cView.prototype.Render = function () {
        if (this.IsHtmlBased) {
            this.prepareViewHtml();
        }
        else
            this.prepareView();
    };
    cView.prototype.Sort = function (direction, colName) {
        this.Adaptor.Sort(direction, colName);
        this.Render();
    };
    return cView;
}());
/*
 * cGridView : Tabular Grid view
 * */
var cGridView = /** @class */ (function (_super) {
    __extends(cGridView, _super);
    function cGridView(containerName, dataSource, colDefs, config) {
        var _this = _super.call(this, containerName, dataSource, config) || this;
        _this.IsFooterRequired = true;
        /*Material icon*/
        _this.sortUpClassName = 'arrow_drop_up'; //glyphicon glyphicon-arrow-up
        _this.sortDownClassName = 'arrow_drop_down'; //glyphicon glyphicon-arrow-down
        _this.pagerFirstClassName = 'first_page'; //glyphicon glyphicon-fast-backward
        _this.pagerPrevClassName = 'chevron_left'; //glyphicon-step-backward
        _this.pagerNextClassName = 'chevron_right'; //glyphicon glyphicon-step-forward
        _this.pagerLastClassName = 'last_page'; //glyphicon glyphicon-fast-forward
        _this.changePageEvent = function (event) {
            //'this' here represents element
            //use self
            //var pn = event.target.getAttribute('data-pagenumber');
            //if (pn == null)
            var pn = event.currentTarget.dataset.pagenumber;
            var oldPage = _this.Adaptor.CurrentPage;
            if (pn === 'first')
                _this.Adaptor.FirstPage();
            else if (pn === 'prev') {
                _this.Adaptor.PrevPage();
            }
            else if (pn === 'next') {
                _this.Adaptor.NextPage();
            }
            else if (pn === 'last')
                _this.Adaptor.LastPage();
            else
                _this.Adaptor.GotoPage(parseInt(pn));
            if (oldPage !== _this.Adaptor.CurrentPage)
                _this.Render();
        };
        _this.changeSortEvent = function (event) {
            //'this' here represents element
            var pn = parseInt(event.target.getAttribute('data-colindex'));
            _this.ColumnsDefs.forEach(function (col, i) {
                if (pn !== i) {
                    col.SortDirection = "";
                }
            });
            var col = _this.ColumnsDefs[pn];
            if (col.SortDirection === "asc") {
                col.SortDirection = "desc";
            }
            else if (col.SortDirection === "desc") {
                col.SortDirection = "";
            }
            else {
                col.SortDirection = "asc";
            }
            _this.Adaptor.Sort(col.SortDirection, col.name);
            _this.Render();
        };
        _this.ColumnsDefs = colDefs;
        if (_this.IsHtmlBased)
            _this.initHandlers();
        _super.prototype.Render.call(_this);
        return _this;
    }
    Object.defineProperty(cGridView.prototype, "Footer", {
        get: function () {
            return this._footer;
        },
        set: function (footer) {
            this._footer = footer;
        },
        enumerable: true,
        configurable: true
    });
    cGridView.prototype.InitView = function () {
        _super.prototype.InitView.call(this);
        this.ViewElement.className += " c-grid-view";
    };
    cGridView.prototype.CreateHeader = function (container) {
        _super.prototype.CreateHeader.call(this, container);
        var headerElement = GetElement('div', 'row c-grid-header-row');
        this.ColumnsDefs.forEach(function (col, i) {
            var title = (col.title != null) ? col.title : '';
            var size = 1;
            var sortSpan = null;
            //let sortCls: string = '';
            var headerColElement = GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width), null, { "data-colindex": i });
            if ((col.name != null) && (col.name.trim() !== '')) {
                if (col.sortable == null || col.sortable == true) {
                    headerColElement.className += ' sorted';
                    headerColElement.style.cursor = 'pointer';
                    headerColElement.onclick = this.changeSortEvent;
                }
                if (col.SortDirection === "asc") {
                    sortSpan = GetElement('span', this.sortUpClassName + ' text-info', 'margin-left:4px;');
                }
                else if (col.SortDirection === "desc") {
                    sortSpan = GetElement('span', this.sortDownClassName + ' text-info', 'margin-left:4px;');
                }
            }
            var textNode = document.createTextNode(title);
            headerColElement.appendChild(textNode);
            if (sortSpan)
                headerColElement.appendChild(sortSpan);
            headerElement.appendChild(headerColElement);
        }, this);
        container.appendChild(headerElement);
        return headerElement;
    };
    ;
    cGridView.prototype.CreateFooter = function (container) {
        _super.prototype.CreateFooter.call(this, container);
        if (!this.IsFooterRequired)
            return null;
        var footerElement = GetElement('div', 'row c-grid-footer-row');
        if (this.Footer) {
            var textNode = document.createTextNode(this.Footer);
            footerElement.appendChild(textNode);
        }
        //create navigation pager
        if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
            return footerElement;
        }
        var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
        var pagerElement = GetElement('nav');
        var ul = GetElement('ul', 'pagination pull-right');
        footerElement.appendChild(ul);
        var li = GetElement('li', 'page-item ' + s);
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data-pagenumber": "first" });
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data": "pagenumber : 'first'" });
        var a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "pagenumber": "first" }, 'First');
        a.dataset.pagenumber = 'first';
        a.onclick = this.changePageEvent;
        //let span = GetElement('span', 'material-icons',null,null,this.pagerFirstClassName);//<i class="material-icons">description</i>
        //let span = GetElement('span', null, null, null, 'First');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
        li = GetElement('li', 'page-item ' + s);
        a = GetElement('a', 'page-link previous' + s, null, { "href": "javascript:void(0)", "pagenumber": "prev" }, 'Previous');
        a.dataset.pagenumber = 'prev';
        a.onclick = this.changePageEvent;
        //span = GetElement('span', null,null,null,'Previous');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
        for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
            var cls = '';
            if (i === this.Adaptor.CurrentPage)
                cls = 'active';
            li = GetElement('li', 'page-item ' + cls);
            a = GetElement('a', 'page-link pagenumber' + s, null, { "href": "javascript:void(0)", "pagenumber": i }, i);
            a.dataset.pagenumber = '' + i;
            a.onclick = this.changePageEvent;
            //let txt = document.createTextNode(''+i);
            //a.appendChild(txt);
            li.appendChild(a);
            ul.appendChild(li);
        }
        s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
        li = GetElement('li', 'page-item ' + s);
        a = GetElement('a', 'page-link next' + s, null, { "href": "javascript:void(0)", "pagenumber": "next" }, 'Next');
        a.dataset.pagenumber = 'next';
        a.onclick = this.changePageEvent;
        //span = GetElement('span', 'material-icons',null,null,this.pagerNextClassName);
        //span = GetElement('span', null, null, null, 'Next');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
        li = GetElement('li', 'page-item ' + s);
        a = GetElement('a', 'page-link last' + s, null, { "href": "javascript:void(0)", "pagenumber": "last" }, 'Last');
        a.dataset.pagenumber = 'last';
        a.onclick = this.changePageEvent;
        //span = GetElement('span', 'material-icons',null,null,this.pagerLastClassName);
        //span = GetElement('span', null, null, null, 'Last');
        //a.appendChild(span);
        li.appendChild(a);
        ul.appendChild(li);
        container.appendChild(footerElement);
        return footerElement;
    };
    ;
    cGridView.prototype.CreateRecord = function (container, row, index) {
        _super.prototype.CreateRecord.call(this, container, row, index);
        var rowElement = GetElement('div', 'row c-grid-row');
        this.ColumnsDefs.forEach(function (col, cIndex) {
            var content;
            if (col.render != null) {
                content = col.render(this, row, cIndex, index, col);
            }
            else {
                if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                    content = row[col.name];
            }
            var colElement = GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width));
            if (content != null) {
                if (IsObject(content)) {
                    colElement.appendChild(content);
                }
                else {
                    var children = GetElementFromHTML(content);
                    if (children != null)
                        while (children.length > 0) {
                            colElement.appendChild(children[0]);
                        }
                    /*children.forEach(child => colElement.appendChild(child))
                    
                    if (Array.isArray(children)) {
                        children.forEach(child => colElement.appendChild(child))
                    } else {
                        colElement.appendChild(children);
                    }
                    */
                }
            }
            rowElement.appendChild(colElement);
        }, this);
        container.appendChild(rowElement);
        return rowElement;
    };
    ;
    cGridView.prototype.initHandlers = function () {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            var html = '<div class="c-grid-view">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetHeaderHtml = function (sender) {
            var html = '<div class="c-grid-header-row row">';
            this.ColumnsDefs.forEach(function (col, i) {
                var title = (col.title != null) ? col.title : '';
                var size = 1;
                var sortSpan = '';
                var sortCls = '';
                if ((col.name != null) && (col.name.trim() !== '')) {
                    sortCls = 'sorted';
                    if (col.SortDirection === "asc") {
                        sortSpan = '<span class="glyphicon glyphicon-arrow-up text-info" style="margin-left:4px;"></span>';
                    }
                    else if (col.SortDirection === "desc") {
                        sortSpan = '<span class="glyphicon glyphicon-arrow-down text-info" style="margin-left:4px;"></span>';
                    }
                    else {
                        sortSpan = '';
                    }
                }
                if (col.width !== undefined) {
                    size = col.width;
                }
                else {
                    col.width = 1;
                }
                html += '<div style="cursor:pointer" data-colindex=' + i + ' class="c-grid-cell col-md-' + size + ' ' + sortCls + '">' + title + sortSpan + '</div>';
            }, this);
            html += '</div>';
            return html;
        };
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            var html = '<div class="c-grid-header-row row">';
            var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';
            for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
                var cls = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }
            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';
            html += pagerStr;
            html += '</div>';
            return html;
        };
        this.OnGetRecordHtml = function (sender, row, index) {
            var html = '<div class="c-grid-row row">';
            this.ColumnsDefs.forEach(function (col, cIndex) {
                var content = '';
                var size = col.width != null ? col.width : 1;
                if (col.render != null) {
                    content = col.render(sender, row, cIndex, index, col);
                }
                else {
                    if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                        content = row[col.name];
                }
                html += '<div class="c-grid-cell col-md-' + size + '">' + content + '</div>';
            }, this);
            html += '</div>';
            return html;
        };
        this.OnAttachedToDOM = function (sender, container) {
            var pagenums = container.getElementsByClassName("pager-btn");
            for (var i = 0; i < pagenums.length; i++) {
                //pagenums[i].myParam = {};
                pagenums[i].addEventListener('click', this.changePageEvent, false);
            }
            var cells = container.getElementsByClassName("c-grid-header-row")[0].getElementsByClassName("sorted");
            for (var i = 0; i < cells.length; i++) {
                //cells[i].myParam = {};
                cells[i].addEventListener('click', this.changeSortEvent, false);
            }
        };
    };
    return cGridView;
}(cView));
/*
 * cCardView : Card Grid view
 * */
var cCardView = /** @class */ (function (_super) {
    __extends(cCardView, _super);
    function cCardView(containerName, data, options) {
        var _this = _super.call(this, containerName, data, options) || this;
        _this.changePageEvent = function (event) {
            //'this' here represents element
            //use self
            var pn = event.target.getAttribute('data-pagenumber');
            var oldPage = _this.Adaptor.CurrentPage;
            if (pn === 'first')
                _this.Adaptor.FirstPage();
            else if (pn === 'prev') {
                _this.Adaptor.PrevPage();
            }
            else if (pn === 'next') {
                _this.Adaptor.NextPage();
            }
            else if (pn === 'last')
                _this.Adaptor.LastPage();
            else
                _this.Adaptor.GotoPage(parseInt(pn));
            if (oldPage !== _this.Adaptor.CurrentPage)
                _this.Render();
        };
        _this.options = (options == null) ? {} : options;
        _this.initHandlers();
        _this.cardTemplate = options.CardTemplate;
        _this.Adaptor.PageSize = (_this.options.PageSize === undefined) ? 3 : _this.options.PageSize;
        _this.cardSize = (options.CardSize === undefined) ? 3 : options.CardSize;
        _this.OnGetCardHtml = options.getCardHtmlCallback;
        _super.prototype.Render.call(_this);
        return _this;
    }
    cCardView.prototype.initHandlers = function () {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            var html = '<div class="card-grid">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetDataViewStartHtml = function (sender) {
            var html = '<div class="row">';
            return html;
        };
        this.OnGetDataViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetHeaderHtml = function (sender) {
            return '';
        };
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            var html = '<div class="card-grid-footer row">';
            var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';
            for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
                var cls = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }
            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';
            html += pagerStr;
            html += '</div>';
            return html;
        };
        this.OnGetRecordHtml = function (sender, row, index) {
            var html = '<div class="col-md-' + this.cardSize + '"><div class="card">';
            if (this.OnGetCardHtml != null) {
                html += this.OnGetCardHtml(row, index, this.cardTemplate);
            }
            html += '</div></div>';
            return html;
        };
        this.OnAttachedToDOM = function (sender, container) {
            var pagenums = container.getElementsByClassName("pager-btn");
            for (var i = 0; i < pagenums.length; i++) {
                //pagenums[i].myParam = {};
                pagenums[i].addEventListener('click', this.changePageEvent, false);
            }
        };
    };
    return cCardView;
}(cView));
/*
 * cGridView : Tabular Grid view
 * */
//function (container, dataSource, colDefs) {
var cTemplatedGridView = /** @class */ (function (_super) {
    __extends(cTemplatedGridView, _super);
    function cTemplatedGridView(containerName, data, colDefs, options) {
        var _this = _super.call(this, containerName, data, options) || this;
        _this.ColumnsDefs = colDefs;
        _this.initHandlers();
        _this.Adaptor.PageSize = 999;
        _super.prototype.Render.call(_this);
        return _this;
    }
    cTemplatedGridView.prototype.initHandlers = function () {
        //object event handlers
        this.OnGetViewStartHtml = function (sender) {
            var html = '<div class="c-grid-view">';
            return html;
        };
        this.OnGetViewEndHtml = function (sender) {
            var html = '</div>';
            return html;
        };
        this.OnGetHeaderHtml = function (sender) {
            var html = '<div class="c-grid-header-row row">';
            this.ColumnsDefs.forEach(function (col, i) {
                var title = (col.title != null) ? col.title : '';
                var size = 1;
                if (col.width !== undefined) {
                    size = col.width;
                }
                else {
                    col.width = 1;
                }
                html += '<div class="c-grid-cell col-md-' + size + '">' + title + '</div>';
            }, this);
            html += '</div>';
            return html;
        };
        this.OnGetFooterHtml = function (sender) {
            if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
                return '';
            }
            var html = '<div class="c-grid-header-row row">';
            var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
            var pagerStr = '<ul class="pagination pull-right" style="margin-top: 5px;margin-bottom: 5px">\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn first" data-pagenumber="first"><span class="glyphicon glyphicon-fast-backward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn previous" data-pagenumber="prev"><span class="glyphicon glyphicon-step-backward"></span></a></li>';
            for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
                var cls = '';
                if (i === this.Adaptor.CurrentPage)
                    cls = 'active';
                pagerStr += '<li class="' + cls + '"><a href="javascript:void(0)" class="pager-btn pagenumber" data-pagenumber="' + i + '">' + i + '</a></li>';
            }
            s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
            pagerStr += '<li class="' + s + '"><a href="javascript:void(0)" class="pager-btn next" data-pagenumber="next"><span class="glyphicon glyphicon-step-forward"></span></a></li>\
            <li class="' + s + '"><a href="javascript:void(0)" class="pager-btn last" data-pagenumber="last"><span class="glyphicon glyphicon-fast-forward"></span></a></li>\
        </ul> ';
            html += pagerStr;
            html += '</div>';
            return html;
        };
        this.OnGetRecordHtml = function (sender, row, index) {
            var html = '<div class="c-grid-row row">';
            this.ColumnsDefs.forEach(function (col, cIndex) {
                var content = '';
                var size = col.width != null ? col.width : 1;
                if (col.render != null) {
                    content = col.render(sender, row, cIndex, index, col);
                }
                else {
                    if ((col.name != null) && (col.name.trim() !== '') && (row[col.name] != null))
                        content = row[col.name];
                }
                html += '<div class="c-grid-cell col-md-' + size + '">' + content + '</div>';
            }, this);
            html += '</div>';
            return html;
        };
    };
    return cTemplatedGridView;
}(cView));
//# sourceMappingURL=cView-2.0.js.map