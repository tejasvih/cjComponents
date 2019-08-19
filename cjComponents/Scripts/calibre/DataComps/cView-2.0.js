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
        var _this = this;
        this.IsFooterRequired = true;
        this.IsHtmlBased = false;
        this.changePageEvent = function (event) {
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
        this.changeSortEvent = function (event) {
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
        //, isHtmlBased: boolean = true
        this.Config = config || {};
        this.Container = document.getElementById(containerName);
        this.Adaptor = new cDataAdaptor(dataSource, []);
        //this.IsHtmlBased = this.Config.IsHtmlBased == null ? true : this.Config.IsHtmlBased;
    }
    Object.defineProperty(cView.prototype, "Footer", {
        get: function () {
            return this._footer;
        },
        set: function (footer) {
            this._footer = footer;
        },
        enumerable: true,
        configurable: true
    });
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
        this.prepareView();
    };
    cView.prototype.Sort = function (direction, colName) {
        this.Adaptor.Sort(direction, colName);
        this.Render();
    };
    cView.prototype.BuildPager = function (container) {
        var pagerElement = GetElement('nav');
        container.appendChild(pagerElement);
        var ul = GetElement('ul', 'pagination pull-right');
        pagerElement.appendChild(ul);
        var s = this.Adaptor.CurrentPage === 1 ? ' disabled ' : '';
        var li = this.getPagingItem("first", 'First', s, ' first ' + s);
        ul.appendChild(li);
        li = this.getPagingItem("prev", 'Previous', s, ' previous ' + s);
        ul.appendChild(li);
        for (var i = 1; i <= this.Adaptor.TotalPages; i++) {
            var cls = '';
            if (i === this.Adaptor.CurrentPage)
                cls = 'active';
            li = this.getPagingItem('' + i, '' + i, cls, ' pagenumber');
            ul.appendChild(li);
        }
        s = this.Adaptor.CurrentPage === this.Adaptor.TotalPages ? ' disabled ' : '';
        li = this.getPagingItem("next", 'Next', s, ' next ' + s);
        ul.appendChild(li);
        li = this.getPagingItem("last", 'Last', s, ' last ' + s);
        ul.appendChild(li);
    };
    cView.prototype.getPagingItem = function (val, title, itemcls, linkcls) {
        var li = GetElement('li', 'page-item ' + itemcls);
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data-pagenumber": "first" });
        //let a = GetElement('a', 'page-link first' + s, null, { "href": "javascript:void(0)", "data": "pagenumber : 'first'" });
        var a = GetElement('a', 'page-link ' + linkcls, null, { "href": "javascript:void(0)", "pagenumber": val }, title);
        a.dataset.pagenumber = val;
        a.onclick = this.changePageEvent;
        //let span = GetElement('span', 'material-icons',null,null,this.pagerFirstClassName);//<i class="material-icons">description</i>
        //let span = GetElement('span', null, null, null, 'First');
        //a.appendChild(span);
        li.appendChild(a);
        return li;
    };
    cView.prototype.addContentToElement = function (content, element) {
        if (content != null) {
            if (IsObject(content)) {
                element.appendChild(content);
            }
            else {
                var children = GetElementFromHTML(content);
                if (children != null)
                    while (children.length > 0) {
                        element.appendChild(children[0]);
                    }
            }
        }
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
        /*Material icon*/
        _this.sortUpClassName = 'arrow_drop_up'; //glyphicon glyphicon-arrow-up
        _this.sortDownClassName = 'arrow_drop_down'; //glyphicon glyphicon-arrow-down
        _this.pagerFirstClassName = 'first_page'; //glyphicon glyphicon-fast-backward
        _this.pagerPrevClassName = 'chevron_left'; //glyphicon-step-backward
        _this.pagerNextClassName = 'chevron_right'; //glyphicon glyphicon-step-forward
        _this.pagerLastClassName = 'last_page'; //glyphicon glyphicon-fast-forward
        _this.ColumnsDefs = colDefs;
        _this.IsHtmlBased = false;
        _super.prototype.Render.call(_this);
        return _this;
    }
    cGridView.prototype.InitView = function () {
        _super.prototype.InitView.call(this);
        this.ViewElement.className += " c-grid-view";
    };
    cGridView.prototype.CreateHeader = function (container) {
        _super.prototype.CreateHeader.call(this, container);
        var headerElement = GetElement('div', 'row c-grid-header-row');
        this.ColumnsDefs.forEach(function (col, i) {
            var title = (col.title != null) ? col.title : '';
            var sortSpan = null;
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
        this.BuildPager(footerElement);
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
            this.addContentToElement(content, colElement);
            rowElement.appendChild(colElement);
        }, this);
        container.appendChild(rowElement);
        return rowElement;
    };
    ;
    return cGridView;
}(cView));
/*
 * cCardView : Card Grid view
 * */
var cCardView = /** @class */ (function (_super) {
    __extends(cCardView, _super);
    function cCardView(containerName, data, options) {
        var _this = _super.call(this, containerName, data, options) || this;
        _this.options = (options == null) ? {} : options;
        _this.cardTemplate = options.CardTemplate;
        _this.Adaptor.PageSize = (_this.options.PageSize === undefined) ? 3 : _this.options.PageSize;
        _this.cardSize = (options.CardSize === undefined) ? 3 : options.CardSize;
        _this.IsHtmlBased = false;
        _this.OnGetCardHtml = options.getCardHtmlCallback;
        _super.prototype.Render.call(_this);
        return _this;
    }
    cCardView.prototype.InitView = function () {
        _super.prototype.InitView.call(this);
        this.ViewElement.className += " card-grid";
    };
    cCardView.prototype.CreateDataContainer = function (container) {
        var element = _super.prototype.CreateDataContainer.call(this, container);
        element.className += " row";
        return element;
    };
    cCardView.prototype.CreateFooter = function (container) {
        _super.prototype.CreateFooter.call(this, container);
        if (!this.IsFooterRequired)
            return null;
        var footerElement = GetElement('div', 'row card-grid-footer');
        if (this.Footer) {
            var textNode = document.createTextNode(this.Footer);
            footerElement.appendChild(textNode);
        }
        //create navigation pager
        if (this.Adaptor.TotalRecords < this.Adaptor.PageSize) {
            return footerElement;
        }
        this.BuildPager(footerElement);
        container.appendChild(footerElement);
        return footerElement;
    };
    cCardView.prototype.CreateRecord = function (container, row, index) {
        _super.prototype.CreateRecord.call(this, container, row, index);
        var cardContainerElement = GetElement('div', GetSizeClass(this.cardSize));
        container.appendChild(cardContainerElement);
        var cardElement = GetElement('div', 'card');
        cardContainerElement.appendChild(cardElement);
        if (this.OnGetCardHtml != null) {
            var content = this.OnGetCardHtml(row, index, this.cardTemplate);
            this.addContentToElement(content, cardElement);
        }
        return cardContainerElement;
    };
    ;
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
        //this.initHandlers();
        _this.Adaptor.PageSize = 999;
        _super.prototype.Render.call(_this);
        return _this;
    }
    cTemplatedGridView.prototype.InitView = function () {
        _super.prototype.InitView.call(this);
        this.ViewElement.className += " c-grid-view";
    };
    cTemplatedGridView.prototype.CreateDataContainer = function (container) {
        var element = _super.prototype.CreateDataContainer.call(this, container);
        element.className += " c-grid-data-container";
        return element;
    };
    cTemplatedGridView.prototype.CreateHeader = function (container) {
        _super.prototype.CreateHeader.call(this, container);
        var headerElement = GetElement('div', 'row c-grid-header-row');
        this.ColumnsDefs.forEach(function (col, i) {
            var title = (col.title != null) ? col.title : '';
            var headerColElement = GetElement('div', 'c-grid-cell ' + GetSizeClass(col.width), null, { "data-colindex": i });
            var textNode = document.createTextNode(title);
            headerColElement.appendChild(textNode);
            headerElement.appendChild(headerColElement);
        }, this);
        container.appendChild(headerElement);
        return headerElement;
    };
    cTemplatedGridView.prototype.CreateRecord = function (container, row, index) {
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
            this.addContentToElement(content, colElement);
            rowElement.appendChild(colElement);
        }, this);
        container.appendChild(rowElement);
        return rowElement;
    };
    return cTemplatedGridView;
}(cView));
//# sourceMappingURL=cView-2.0.js.map